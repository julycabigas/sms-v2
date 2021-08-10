import React, {useState, useCallback} from 'react'
import { useDispatch } from 'react-redux'
import Box from 'components/Box'
import { Input, DatePicker, Select } from 'components/Forms'
import moment from 'moment'
import { addDeposit } from 'store/reducer/depositReducer'
import { useHistory } from 'react-router-dom'
import { currencies } from 'helpers/dropdown'
import { useHttp } from 'hooks'

export const AddDeposit = ({ studentId, currency }) => {
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(new Date())
  const [disabledSubmit, setDisabledSubmit] = useState(false)
  const [currencyForm, setCurrencyForm] = useState(currency || '')
  const dispatch = useDispatch()
  const history = useHistory()
  const http = useHttp()

  const handleAddDeposit = useCallback(async (e) => {
    e.preventDefault()
    setDisabledSubmit(true)
    const { data } = await http.post(
      `/api/student/${studentId}/deposit`, 
      { amount, date, currency: currencyForm }
    )
    if (data) {
      setTimeout(() => {
        setDisabledSubmit(false)
        dispatch( 
          addDeposit(data) 
        )
        history.replace('/deposits')
      }, 300)
    }
  }, [amount, date, studentId, history, dispatch, currencyForm])

  return (
    <Box hasShadow={true} maxWidth="400px" title="Add Deposit" titleSize="1.1em">
      <form onSubmit={handleAddDeposit} className="py-4 px-2">
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <Input label="Amount" type="number" placeholder="Amount"
                value={amount}
                required
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-6">
            <Select 
              label="Currency"
              required
              value={currencyForm}
              onChange={(e) => setCurrencyForm(e.target.value)}
              options={['', ...currencies].map(value => ({ value }))}
            />
          </div>
        </div>
        <div className="form-group">
          <DatePicker className="regular" label="Date" format="YYYY-MM-DD" placeholder="Date" 
            required
            value={moment.utc(date)}
            onChange={(date, dateString) => setDate(dateString)}
          />
        </div>
        <button disabled={disabledSubmit} type="submit" className="btn btn-primary">Add Deposit</button>
      </form>
    </Box>
  )
}

export default AddDeposit
