import React, { useState, useEffect } from 'react';
import {useDispatch } from 'react-redux';
import Button from 'react-bootstrap/Button';
import * as Forms from 'components/Forms';
import { recurrence as dReccurence, currencies } from 'helpers/dropdown';
import { useHttp } from 'hooks';
import { updateDocs } from 'store/reducer/planReducer';
import Modal from 'components/Modal';
import { toast } from 'react-toastify';

export const Edit = ({ planId, onModalClose, modalShow }) => {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('');
  const [quantity, setQuantity] = useState('');
  const [recurrence, setRecurrence] = useState('');
  const [resultName, setResultName] = useState('');
  const [disabledBtn, setDisabledBtn] = useState(false);
  const dispatch = useDispatch();
  const http = useHttp();
  const [fetchLoading, setFetchLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDisabledBtn(true);
    const payload = { 
      amount: Number(amount), 
      quantity: Number(quantity), 
      currency, 
      recurrence, 
      resultName, 
    };
    const { data } = await http.post(`/api/plan/${planId}`, payload);
    toast.success('Plan successfully updated.');
    onModalClose();
    dispatch( updateDocs({ _id: planId, doc: data }) );
  };

  useEffect(() => {
    (async () => {
      setFetchLoading(true);
      const { data } = await http.get(`/api/plan/${planId}`);
      setFetchLoading(false);
      setAmount(data.amount.$numberDecimal);
      setCurrency(data.currency);
      setQuantity(data.quantity);
      setRecurrence(data.recurrence);
      setResultName(data.resultName);
    })();
  }, [planId]);

  return (
    <Modal 
      title="Update Plan" 
      show={modalShow}
      onClose={onModalClose}
      width="500px"
      allowClickOutside={false}
    >
      {fetchLoading ? (
        <p className="text-center my-3">Loading...</p>
      ) : (
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
                disabled={disabledBtn}
                variant="light" 
                className="mr-2"
                onClick={onModalClose}
                type="button">Cancel</Button>
              <Button 
                disabled={disabledBtn} 
                type="submit">Update</Button>
            </div>
          </Modal.Footer>
        </form>
      )}
    </Modal>
  )
}

export default Edit;

function FormGroup(props) {
  return (
    <div className="form-group" {...props}>
      {props.children}
    </div>
  );
}
