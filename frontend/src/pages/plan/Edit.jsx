import React, { useCallback } from 'react'
import { connect, useDispatch } from 'react-redux'
import Button from 'react-bootstrap/Button'
import * as Forms from 'components/Forms'
import { recurrence as dReccurence, currencies } from 'helpers/dropdown'
import { useHttp } from 'hooks'
import { setEdit, updateDocs } from 'store/reducer/planReducer'
import Box from 'components/Box'

export const Edit = (props) => {
  const [amount, setAmount] = React.useState('')
  const [currency, setCurrency] = React.useState('')
  const [quantity, setQuantity] = React.useState('')
  const [recurrence, setRecurrence] = React.useState('')
  const [resultName, setResultName] = React.useState('')
  const [disabledBtn, setDisabledBtn] = React.useState(false)
  const dispatch = useDispatch()
  const http = useHttp()

  const doc = props.plan && props.plan.docs && props.plan.docs.find(item => item._id === props.editId)

  const handleSubmit = useCallback(async (e) => {
    let isMounted = false
    e.preventDefault()
    setDisabledBtn(true)
    const payload = { 
      amount: Number(amount), 
      quantity: Number(quantity), 
      currency, 
      recurrence, 
      resultName, 
    }
    const res = await http.post(`/api/plan/${props.editId}`, payload);
    if (res.data) {
      dispatch( updateDocs({ _id: props.editId, doc: res.data }) )
      dispatch( setEdit({ isEdit: false, _id: null }) )
    }
    if (isMounted) {
      setDisabledBtn(false)
      setAmount('')
      setCurrency('')
      setRecurrence('')
      setQuantity('')
      setResultName('')
    }
    return () => { isMounted = true }
  }, [amount, currency, quantity, recurrence, resultName, props.editId, dispatch])

  React.useEffect(() => {
    if (props.isEdit) {
      if (doc) {
        setAmount(doc.amount || '')
        setCurrency(doc.currency || '')
        setRecurrence(doc.recurrence || '')
        setQuantity(doc.quantity || '')
        setResultName(doc.resultName || '')
      }
    }
  }, [props.isEdit, doc])

  return (
    <Box title="Edit Plan" hasBackBtn={false}>
      <form onSubmit={handleSubmit} className="py-4 px-3">
        <FormGroup>
          <div className="row">
            <div className="col-md-6">
              <Forms.Input 
                type="number"
                label="Amount" 
                id="Amount"
                placeholder="Enter Amount..."
                required
                onChange={e => setAmount(e.target.value)}
                value={amount}
              />
            </div>
            <div className="col-md-6">
              <Forms.Select 
                label="Currency" 
                id="Currency"
                placeholder="Enter Currency..."
                required
                options={['', ...currencies].map(text => ({text}))}
                onChange={e => setCurrency(e.target.value)}
                value={currency}
              />
            </div>
          </div>
        </FormGroup>
        <FormGroup>
          <Forms.Input 
            type="number"
            label="Quantity" 
            id="Quantity"
            placeholder="Enter Quantity..."
            required
            onChange={e => setQuantity(e.target.value)}
            value={quantity}
          />
        </FormGroup>
        <FormGroup>
          <Forms.Select 
            label="Recurrence" 
            id="Recurrence"
            placeholder="Enter Recurrence..."
            required
            options={['', ...dReccurence].map(value => ({ value }))}
            onChange={e => setRecurrence(e.target.value)}
            value={recurrence}
          />
        </FormGroup>
        <FormGroup>
          <Forms.Input 
            label="Name" 
            id="Name"
            placeholder="Enter Name..."
            required
            onChange={e => setResultName(e.target.value)}
            value={resultName}
          />
        </FormGroup>
        <div className="text-right">
          <Button 
            disabled={disabledBtn}
            variant="light" 
            className="mr-2"
            onClick={() => dispatch(setEdit({ isEdit: false, _id: null }))}
            type="button">Cancel</Button>
          <Button 
            disabled={disabledBtn} 
            type="submit">Update</Button>
        </div>
      </form>
    </Box>
  )
}

const mapStateToProps = (state) => ({
  isEdit: state.plan.isEdit,
  editId: state.plan.editId,
  plan: state.plan.planDocs
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Edit)

function FormGroup(props) {
  return (
    <div className="form-group" {...props}>
      {props.children}
    </div>
  )
}
