import React from 'react'
import { connect } from 'react-redux'
import { Table } from './index.style'
import styled from 'styled-components'
import moment from 'moment'
import { useForm } from 'react-hook-form'
import { Input, DatePicker, Select } from 'components/Forms'
import { funnels, paymentMethods, paymentStatus, pipelines, salesRep } from 'helpers/dropdown'
import { useHttp } from 'hooks'
import { Link, useHistory } from 'react-router-dom'
import { getDetails } from 'store/reducer/studentDetails'
import { useDispatch } from 'react-redux'

export const Edit = ({ studentDetails }) => {
  const [disabledSubmit, setDisabledSubmit] = React.useState(false)
  const dispatch = useDispatch()
  const history = useHistory()
  const http = useHttp()

  const handleUpdateSubmit = React.useCallback(async (e) => {
    e.preventDefault()
    setDisabledSubmit(true)
    const payload = {}
    const formData = new FormData(e.target)
    for (const [key, value] of formData.entries()) {
      payload[key] = value
    }
    const { data } = await http.put(`/api/student/${studentDetails._id}`, payload)
    setTimeout(() => {
      dispatch( getDetails({ isFetching: false, studentDetails: data }) )
      setDisabledSubmit(false)
      history.push('/home')
    }, 300)
  }, [studentDetails, dispatch, history])

  return (
    <form className="row" onSubmit={handleUpdateSubmit}>
      <div className="col-md-6 p-0">
        <div className="p-3">
          {studentDetails && <StudentInfo studentDetails={studentDetails} />}
        </div>
      </div>
      <div className="col-md-6 p-0">
        <div className="border-left p-3">
          {studentDetails && <PaymentInfo studentDetails={studentDetails} />}
        </div>
      </div>
      {studentDetails && (
        <div className="col-md-12 py-4 text-right">
          <Link to="/home" className="btn btn-light mr-2" disabled={disabledSubmit}>Cancel</Link>
          <button className="btn btn-primary" type="submit" disabled={disabledSubmit}>Update</button>
        </div>
      )}
    </form>
  )
}

const mapStateToProps = (state) => ({
  studentDetails: state.studentDetails.studentDetails
})
export default connect(mapStateToProps)(Edit)

const PaymentInfo = ({ studentDetails: _ }) => {
  const [plans, setPlans] = React.useState([]) 
  const [paymentDateStartForm, setPaymentDateStartForm] = React.useState(_.payment_date_start)
  const [joinedDateForm, setJoinedDateForm] = React.useState(_.joined_date)
  const [planForm, setPlanForm] = React.useState(_.plan._id)
  const defaultValues = {
    signed_contract: _.signed_contract,
    sales_rep: _.sales_rep,
    payment_method: _.payment_method,
    payment_status: _.payment_status,
  }
  const { register } = useForm({ defaultValues })
  const http = useHttp()

  React.useEffect(() => {
    let unmount = true
    if (unmount) {
      (async () => {
        const { data } = await http.get('/api/plan/all')
        if (unmount) {
          setPlans(data)
          setPlanForm(_.plan._id)
        }
      })()
    }
    return () => unmount = false
  }, [_])

  return (
    <Table className="table">
      <tbody>
        <TableRow label="Payment Plan:" value={
          <Select 
            disabled
            className="form-control-sm" 
            value={planForm}
            onChange={(e) => setPlanForm(e.target.value)}
            options={['', ...plans].map(item => ({ text: item.resultName, value: item._id }))}
          />
        } />
        <TableRow label="Payment Date Start:" value={
          <DatePicker 
            required
            name="payment_date_start"
            className="w-100"
            format="YYYY-MM-DD"
            value={moment.utc(paymentDateStartForm || new Date())}
            onChange={(date, dateString) => setPaymentDateStartForm(dateString)}
          />
        } />
        <TableRow label="Signed Contract:" value={
          <Select 
            required
            className="form-control-sm" 
            {...register('signed_contract')} 
            options={['', 'Yes', 'No'].map(value => ({ value }))}
          />
        } />
        <TableRow label="Sales Rep:" value={
          <Select
            required
            className="form-control-sm"
            {...register('sales_rep')}
            options={['', ...salesRep].map(value => ({ value }))}
          />
        } />
        <TableRow label="Payment Method:" value={
          <Select
            required
            className="form-control-sm"
            {...register('payment_method')}
            options={['', ...paymentMethods].map(value => ({ value }))}
          />
        } />
        <TableRow label="Payment Status:" value={
          <Select
            required
            className="form-control-sm"
            {...register('payment_status')}
            options={['', ...paymentStatus].map(value => ({ value }))}
          />
        } />
        <TableRow label="Joined Date:" value={
          <DatePicker 
            required
            name="joined_date"
            className="w-100"
            format="YYYY-MM-DD"
            value={moment.utc(joinedDateForm || new Date())}
            onChange={(date, dateString) => setJoinedDateForm(dateString)}
          />
        } />
      </tbody>
    </Table>
  )
}

const StudentInfo = ({ studentDetails: _ }) => {
  const defaultValues = {
    first_name: _.first_name,
    last_name: _.last_name,
    email: _.email,
    phone: _.phone,
    country: _.country,
    pipeline: _.pipeline,
    funnel: _.funnel,
  }

  const { register } = useForm({ defaultValues })

  return (
    <Table className="table">
      <tbody>
      <TableRow label="First Name:" value={
        <Input 
          required
          className="form-control-sm"
          {...register('first_name')}
        />
      } />
      <TableRow label="Last Name:" value={
        <Input 
          required
          className="form-control-sm"
          {...register('last_name')}
        />
      } />
      <TableRow label="Email:" value={
        <Input 
          required
          className="form-control-sm"
          {...register('email')}
        />
      } />
      <TableRow label="Phone:" value={
        <Input 
          required
          className="form-control-sm"
          {...register('phone')}
        />
      } />
      <TableRow label="Country:" value={
        <Input 
          required
          className="form-control-sm"
          {...register('country')}
        />
      } />
      <TableRow label="Pipeline:" value={
        <Select 
          required
          className="form-control-sm"
          {...register('pipeline')}
          options={['', ...pipelines].map(value => ({ value }))}
        />
      } />
      <TableRow label="Funnel:" value={
        <Select 
          required
          className="form-control-sm"
          {...register('funnel')}
          options={['', ...funnels].map(value => ({ value }))}
        />
      } />
      </tbody>
    </Table>
  )
}

const TableRow = ({ label, value }) => (
  <tr>
    <MediumTd>{label}</MediumTd>
    <td>{value}</td>
  </tr>
)

const MediumTd = styled.td`
  font-size: 0.9em;
`
