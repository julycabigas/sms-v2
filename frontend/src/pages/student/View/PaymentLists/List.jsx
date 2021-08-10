import React from 'react'
import { connect, useDispatch } from 'react-redux'
import moment from 'moment'
import * as style from './paymentLists.style'
import { currencies, paymentListStatus } from 'helpers/dropdown'
import { DatePicker, Input, Select } from 'components/Forms'
import { updatePaymentList, deletePaymentList } from 'store/reducer/paymentLists'
import { useHttp } from 'hooks'
import { Link } from 'react-router-dom'
import { useQuery } from 'hooks'
import Pagination from 'components/Pagination'
import { PaginationWrapper } from 'styled'
import { allPaymentList } from 'store/reducer/paymentLists'

export const List = ({ listDocs, match, student ,payment, isFetching, totalDocs }) => {
  const query = useQuery()
  const dispatch = useDispatch()
  const studentId = student && student._id
  const queries = query.toString()
  const http = useHttp()

  React.useEffect(() => {
    let unmount = true
    if (unmount) {
      (async () => {
        dispatch( allPaymentList({ isFetching: true }) )
        if (studentId) {
          const { data } = await http.get(
            `/api/student/${studentId}/payment_list?${queries}`
          )
          dispatch( allPaymentList({ isFetching: false, payment: data }) )
        }
      })()
    }
    return () => unmount = false
  }, [dispatch, studentId, queries])

  return (
    <>
      <div className="lists-actions mb-3">
        <Link to={`${match.url}/add`} className="btn btn-sm btn-primary">Add Payment</Link>
      </div>
      <ListContainer listDocs={listDocs} isFetching={isFetching} totalDocs={totalDocs} />
      {payment && (payment.totalDocs > payment.limit) && <PaginationWrapper className="p-0">
        <Pagination 
          totalPages={payment && payment.totalPages}
          current={payment && payment.page}
        />
      </PaginationWrapper>}
    </>
  )
}

const mapStateToProps = (state) => ({
  listDocs: state.paymentList.payment && state.paymentList.payment.docs,
  limit: state.paymentList.payment && state.paymentList.payment.limit,
  payment: state.paymentList.payment,
  student: state.studentDetails.studentDetails,
  isFetching: state.paymentList.isFetching,
  totalDocs: state.paymentList.payment && state.paymentList.payment.totalDocs,
})

export default connect(mapStateToProps)(List)


const ListContainer = ({ listDocs, isFetching, totalDocs }) => {
  const [editList, setEditList] = React.useState({ isEdit: false, index: null })
  const [disabledUpdateBtn, setDisabledUpdateBtn] = React.useState(false)
  const dispatch = useDispatch()
  const http = useHttp()

  const onDelete = React.useCallback(async (index) => {
    const { studentId, _id: paymentListId } = listDocs[index]
    setDisabledUpdateBtn(true)
    const { data } = await http.put(`/api/student/${studentId}/payment_list/${paymentListId}`, { is_deleted: true })
    if (data) {
      setTimeout(() => {
        dispatch( deletePaymentList({ index }) )
        setDisabledUpdateBtn(false)
      }, 300)
    }
  }, [dispatch, listDocs])

  const onUpdate = React.useCallback(async (e) => {
    e.preventDefault()
    setDisabledUpdateBtn(true)
    const payload = {}
    const formData = new FormData(e.target)
    for (const [key, value] of formData.entries()) {
      payload[key] = value
    }
    const { studentId, _id: paymentListId } = listDocs[editList.index]
    const { data } = await http.put(`/api/student/${studentId}/payment_list/${paymentListId}`, {...payload})
    setTimeout(() => {
      dispatch( updatePaymentList({ index: editList.index, paymentData: data }) )
      setDisabledUpdateBtn(false)
      setEditList({ index: null, isEdit: false })
    }, 300)
  }, [editList, listDocs, dispatch])

  return (
    <form onSubmit={onUpdate}>
      <table className="table table-bordered">
        <tbody>
          <ListHead />
          {isFetching && (
            <tr><style.TdSmall colSpan="5" className="text-center">Loading...</style.TdSmall></tr>
          )}
          {totalDocs === 0 && !isFetching && (
            <tr><style.TdSmall colSpan="5" className="text-center">No Results Found.</style.TdSmall></tr>
          )}
          {listDocs && listDocs.map((doc, index) => (
            <React.Fragment key={index}>
              {(editList.isEdit && editList.index === index) ? (
                <FormUpdate
                  disabledUpdateBtn={disabledUpdateBtn}
                  doc={doc}
                  onCancel={() => setEditList({ index: null, isEdit: false })}
                />  
              ) : (
                <ListData 
                  key={index} 
                  doc={doc}
                  disabledUpdateBtn={disabledUpdateBtn}
                  onEdit={() => setEditList({ index, isEdit: true })}
                  onDelete={() => onDelete(index)}
                />
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </form>
  )
}

const FormUpdate = ({ doc, onCancel, disabledUpdateBtn }) => {
  return (
    <tr>
      <td>
        <div className="d-flex align-items-center">
          <Input 
            type="number"
            required
            defaultValue={doc.amount}
            name="amount"
            className="form-control-sm mr-2"
          />
          <Select 
            required
            defaultValue={doc.currency}
            name="currency"
            className="form-control-sm"
            options={['', ...currencies].map(value => ({ value }))}
          />
        </div>
      </td>
      <td>
        <DatePicker 
          name="due_date"
          format="YYYY-MM-DD"
          defaultValue={doc.due_date ? moment.utc(doc.due_date) : null}
        />
      </td>
      <td>
        <DatePicker 
          name="date_paid"
          format="YYYY-MM-DD"
          defaultValue={doc.date_paid ? moment.utc(doc.date_paid) : null}
        />
      </td>

      <td>
        <Select 
          required
          defaultValue={doc.status}
          name="status"
          className="form-control-sm"
          options={['', ...paymentListStatus].map(value => ({ value }))}
        />
      </td>
      <td>
        <button type="submit" className="btn btn-sm btn-success mr-2"
          disabled={disabledUpdateBtn}
        >
            Update
        </button>
        <button type="button" className="btn btn-sm btn-primary" 
          disabled={disabledUpdateBtn}
          onClick={onCancel}>
            Cancel
        </button>
      </td>
    </tr>
  )
}

const ListData = ({ doc, onEdit, onDelete, disabledUpdateBtn }) => (
  <tr>
    <style.TdSmall>{doc && doc.amount} {doc && doc.currency}</style.TdSmall>
    <style.TdSmall>{doc && doc.due_date && moment.utc(doc.due_date).format('MMM DD, YYYY')}</style.TdSmall>
    <style.TdSmall>{(doc && doc.date_paid) ? moment.utc(doc.date_paid).format('MMM DD, YYYY') : '---'}</style.TdSmall>
    <style.TdSmall>{doc && doc.status}</style.TdSmall>
    <style.TdSmall>
      <button type="button" className="btn btn-sm text-primary mr-2" 
        onClick={onEdit}
        disabled={disabledUpdateBtn}
      >Edit</button>
      <button type="button" className="btn btn-sm text-danger" 
        onClick={onDelete}
        disabled={disabledUpdateBtn}
      >Delete</button>
    </style.TdSmall>
  </tr>
)

const ListHead = () => (
  <tr>
    <style.TdSmall>Amount</style.TdSmall>
    <style.TdSmall>Due Date</style.TdSmall>
    <style.TdSmall>Date Paid</style.TdSmall>
    <style.TdSmall>Status</style.TdSmall>
    <style.TdSmall>Action</style.TdSmall>
  </tr>
)
