import React, { useCallback } from 'react'
import { connect, useDispatch } from 'react-redux'
import Box from 'components/Box'
import { Input, Select, DatePicker } from 'components/Forms'
import { currencies, paymentListStatus } from 'helpers/dropdown'
import { useHttp } from 'hooks'
import { addPaymentList } from 'store/reducer/paymentLists'
import { useHistory } from 'react-router-dom'

export const AddPayment = ({ student, match }) => {
  const [disabledSubmit, setDisabledSubmit] = React.useState(false)
  const dispatch = useDispatch()
  const history = useHistory()
  const http = useHttp()

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    setDisabledSubmit(true)
    const formData = new FormData(e.target)
    const payload = {}
    payload.student = student._id
    payload.plan = student.plan && student.plan._id
    for (const [key, value] of formData.entries()) {
      payload[key] = value
    }
    const { data } = await http.post(`/api/student/${student._id}/payment_list`, payload)
    setTimeout(() => {
      setDisabledSubmit(false)
      dispatch( addPaymentList({ data }) )
      history.replace(match.url)
    }, 300)
  }, [student, dispatch, history, match])

  return (
    <Box title="Add Payment" maxWidth="400px" hasShadow={true} titleSize="1.1em">
      <form className="p-3" onSubmit={handleSubmit}>
        <FormGroup>
          <div className="col-md-6">
            <Input type="number" label="Amount" name="amount" required 
              defaultValue={student && student.plan && student.plan.amount}
            />
          </div>
          <div className="col-md-6">
            <Select 
              label="Currency"
              name="currency" required
              defaultValue={student && student.currency}
              options={['', ...currencies].map(value => ({ value }))}
            />
          </div>
        </FormGroup>
        <FormGroup>
          <div className="col-md-6">
            <DatePicker 
              name="due_date"
              className="regular w-100"
              format="YYYY-MM-DD"
              label="Due Date"
              required
            />
          </div>
          <div className="col-md-6">
            <DatePicker 
              name="date_paid"
              className="regular w-100"
              format="YYYY-MM-DD"
              label="Date Paid"
              required
            />
          </div>
        </FormGroup>
        <div className="form-group">
          <Select 
            required
            label="Status"
            name="status"
            options={['', ...paymentListStatus].map(value => ({ value }))}
          />
        </div>
        <div className="text-right">
          <button type="submit" className="btn btn-primary" disabled={disabledSubmit}>
            Submit
          </button>
        </div>
      </form>
    </Box>
  )
}

const mapStateToProps = (state) => ({
  student: state.studentDetails.studentDetails
})

export default connect(mapStateToProps)(AddPayment)

const FormGroup = ({ children }) => (
  <div className="form-group">
    <div className="row">
      {children}
    </div>
  </div>
)
