import moment from 'moment'
import React from 'react'
import { connect, useDispatch } from 'react-redux'
import * as style from './deposit.style'
import { Input, DatePicker, Select } from 'components/Forms'
import { setEditDeposit } from 'store/reducer/studentDetails'
import { updateDeposit, deleteDeposit } from 'store/reducer/depositReducer'
import { Link, Route, Switch } from 'react-router-dom'
import AddDeposit from './AddDeposit'
import { currencies } from 'helpers/dropdown'
import { useHttp } from 'hooks'

export const Deposit = ({ match, deposit, currency, studentId, editDeposit }) => {
  return (
    <>
      <DepositWrapper>
        <Switch>
          <Route exact path={`${match.url}/add`}>
            <AddDeposit studentId={studentId} currency={currency} />
          </Route>
          <Route exact path={`${match.url}`}>
            <DetailWrap match={match}>
              {deposit && deposit.map((item, key) => (
                <Detail 
                  deposits={deposit}
                  studentId={studentId} 
                  key={key} 
                  index={key} 
                  editDeposit={editDeposit}
                  {...item}
                />
              ))}
              {deposit && deposit.length === 0 && (
                <tr><td colSpan="3" className="text-center">No Deposit added.</td></tr>
              )}
            </DetailWrap>
          </Route>
        </Switch>
      </DepositWrapper>
    </>
  )
}

const mapStateToProps = (state) => ({
  currency: state.studentDetails.studentDetails && state.studentDetails.studentDetails.currency,
  deposit: state.deposit && state.deposit.deposit,
  studentId: state.studentDetails.studentDetails && state.studentDetails.studentDetails._id,
  editDeposit: state.studentDetails.editDeposit,
})
export default connect(mapStateToProps)(Deposit)

const Detail = ({ deposits, studentId, index, currency, amount, date, editDeposit }) => {
  const dispatch = useDispatch()
  const [disabledDelBtn, setDisabledDelBtn] = React.useState(false)
  const http = useHttp()

  const onDeleteDeposit = React.useCallback(async () => {
    const _ = deposits.length && deposits[index]
    const { data } = await http.delete(`/api/student/${studentId}/deposit/${_ && _._id}`)
    setDisabledDelBtn(true)
    if (data.success === true) {
      setTimeout(() => {
        setDisabledDelBtn(false)
        dispatch( deleteDeposit({ _id: _ && _._id }) )
      }, 300)
    }
  }, [index, studentId, dispatch, deposits])

  return (<>
    <tr>
      {editDeposit.isEdit && editDeposit.index === index ? (
        <Form 
          deposits={deposits}
          studentId={studentId}
          currency={currency} 
          amount={amount} 
          date={date} 
          depositIndex={index}
          onCancel={() => dispatch( setEditDeposit({index: null, isEdit: false}) )}
        />
      ) : (
        <Data currency={currency} amount={amount} date={date} />
      )}
      {!editDeposit.isEdit && !editDeposit.index && 
        <Actions 
          disabledDelBtn={disabledDelBtn}
          onEdit={() => dispatch( setEditDeposit({ index, isEdit: true }) )} 
          onDelete={onDeleteDeposit}
        />}
    </tr>
  </>)
}

const Form = ({ deposits, studentId, depositIndex, currency, amount, date, onCancel }) => {
  const [formAmount, setFormAmount] = React.useState(amount)
  const [formDate, setFormDate] = React.useState(date)
  const [formCurrency, setFormCurrency] = React.useState(currency)
  const [disabledSubmit, setDisabledSubmit] = React.useState(false)
  const dispatch = useDispatch()
  const http = useHttp()

  const onUpdate = React.useCallback(async () => {
    const deposit = {
      ...deposits[depositIndex], 
      amount: formAmount, 
      date: formDate,
      currency: formCurrency,
    }
    setDisabledSubmit(true)
    const { data } = await http.put(`/api/student/${studentId}/deposit`, deposit)
    if (data) {
      setTimeout(() => {
        setDisabledSubmit(false)
        dispatch( updateDeposit({ _id: data._id, deposit: data }) )
        dispatch( setEditDeposit({ index: null, isEdit: false }) )
      }, 200)
    }
  }, [studentId, deposits, depositIndex, formAmount, formDate, dispatch, formCurrency])
  
  return (
    <>
      <FormInputWrap>
        <Input type="number" className="form-control-sm mr-2 w-50" 
          value={formAmount}
          onChange={(e) => setFormAmount(e.target.value)}
        />
        <Select 
          className="form-control-sm"
          value={formCurrency || ''}
          onChange={e => setFormCurrency(e.target.value)}
          options={['', ...currencies].map(value => ({ value }))}
        />
      </FormInputWrap>
      <FormInputWrap>
        <DatePicker 
          format="YYYY-MM-DD"
          value={moment.utc(formDate || new Date())}
          onChange={(date, dateString) => setFormDate(dateString)}
        />
      </FormInputWrap>
      <FormInputWrap>
        <button 
          disabled={disabledSubmit}
          onClick={onUpdate}
          className="btn btn-success btn-sm mr-2">
          Update
        </button>
        <button 
          disabled={disabledSubmit}
          className="btn btn-primary btn-sm" 
          onClick={onCancel}>
            Cancel
        </button>
      </FormInputWrap>
    </>
  )
}


// Stateless component
const DetailWrap = ({ match, children }) => (<>
  <Link to={`${match.url}/add`} className="btn btn-sm btn-primary mb-3">
    Add Deposit
  </Link>
  <table className="table table-bordered">
    <tbody>
      <tr>
        <style.HeadTd>Amount</style.HeadTd>
        <style.HeadTd>Date</style.HeadTd>
        <style.HeadTd>Action</style.HeadTd>
      </tr>
      {children}
    </tbody>
  </table>
</>)

const FormInputWrap = ({children}) => (
  <td>
    <div className="d-flex align-items-center justify-content-center">
      {children}
    </div>
  </td>
)

const Actions = ({ onEdit, onDelete, disabledDelBtn }) => (
  <style.HeadTd className="text-center">
    <button disabled={disabledDelBtn} className="btn text-primary btn-sm mr-2" onClick={onEdit}>Edit</button>
    <button className="btn text-danger btn-sm" onClick={onDelete}>Delete</button>
  </style.HeadTd>
)

const DepositWrapper = ({ children }) => (
  <div className="row">
    <div className="col-md-8">
      <div className="pt-4 pb-4">
        {children}
      </div>
    </div>
  </div>
)

const Data = ({ currency, amount, date }) => <>
    <style.HeadTd>
      {amount} <span>{currency}</span>
    </style.HeadTd>
    <style.HeadTd>
      {moment.utc(date).format('MMM DD, YYYY')}
    </style.HeadTd>
  </>