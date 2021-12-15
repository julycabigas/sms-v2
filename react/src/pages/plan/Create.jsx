import React from 'react';
import { connect, useDispatch } from 'react-redux';
import Button from 'react-bootstrap/Button';
import * as Forms from 'components/Forms';
import { recurrence as dReccurence, currencies } from 'helpers/dropdown';
import { useHttp } from 'hooks';
import { addDocs } from 'store/reducer/planReducer';
import { toast } from 'react-toastify';
import Modal from 'components/Modal';

export const Create = ({ onModalClose, modalShow }) => {
  const [amount, setAmount] = React.useState('');
  const [currency, setCurrency] = React.useState('');
  const [quantity, setQuantity] = React.useState('');
  const [recurrence, setRecurrence] = React.useState('');
  const [resultName, setResultName] = React.useState('');
  const [disabledBtn, setDisabledBtn] = React.useState(false);
  const dispatch = useDispatch();
  const http = useHttp();

  const handleSubmit = async (e) => {
    e.preventDefault()
    setDisabledBtn(true)
    const payload = { 
      amount: Number(amount), 
      quantity: Number(quantity), 
      currency, 
      recurrence, 
      resultName, 
    }
    const res = await http.post('/api/plan', payload);
    if (res.data) {
      toast.success('Plan successfully added.');
      dispatch( addDocs(res.data) );
      onModalClose();
    }
  };

  React.useEffect(() => {
    if (amount && currency && recurrence && quantity) {
      setResultName(`${amount} ${currency} × ${quantity} ${recurrence}`);
    }
  }, [amount, currency, quantity, recurrence]);

  return (
    <Modal 
      title="Create Plan" 
      show={modalShow} 
      onClose={onModalClose}
      width="500px"
      allowClickOutside={false}
    >
      <form onSubmit={handleSubmit}>
        <Modal.Body>
          <div className="p-3">
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
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="text-right">
            <Button 
              variant="light"
              disabled={disabledBtn}
              className="mr-2" 
              onClick={onModalClose}
              type="button">Cancel</Button>
            <Button 
              disabled={disabledBtn} 
              type="submit">Submit</Button>
          </div>
        </Modal.Footer>
      </form>
    </Modal>
  )
}

const mapStateToProps = (state) => ({})
export default connect(mapStateToProps)(Create)

function FormGroup(props) {
  return (
    <div className="form-group" {...props}>
      {props.children}
    </div>
  )
}
