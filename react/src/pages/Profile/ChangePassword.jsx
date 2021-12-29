import React from 'react';
import Modal from 'components/Modal';
import { Input } from 'components/Forms';

const ChangePassword = ({ modalShow, onModalClose }) => {
  return (
    <Modal
      show={modalShow}
      onClose={onModalClose}
      title="Change Password"
    >
      <form>
        <div className="py-2">
          <Modal.Body>
            <div className="form-group">
              <Input
                label="Old Password" 
                placeholder="Old Password"
                type="password"
              />
            </div>
            <div className="form-group">
              <Input
                label="New Password" 
                placeholder="New Password"
                type="password"
              />
            </div>
            <div className="form-group mb-0">
              <Input
                label="Retype New Password" 
                placeholder="Retype New Password"
                type="password"
              />
            </div>
          </Modal.Body>
        </div>
        <Modal.Footer>
          <div className="text-right">
            <button 
              type="button" 
              className="btn btn-light mr-2" 
              onClick={onModalClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
            >
              Submit
            </button>
          </div>
        </Modal.Footer>
      </form>
    </Modal>
  )
}

export default ChangePassword;