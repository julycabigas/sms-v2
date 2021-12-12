import React, { useState, useCallback } from 'react';
import Modal from 'components/Modal';
import { AiOutlineCloudUpload, AiOutlineEdit } from 'react-icons/ai';
import { FaTimes } from 'react-icons/fa';
import { PhotoChooser, PhotoChooserWrapper } from './create.style';
import { Input } from 'components/Forms';

function Create({ modalShow, onModalClose }) {
  const [selectedFile, setSelectedFile] = useState(null);

  const onPhotoChange = useCallback((ev) => {
    const [file] = ev.target.files;
    setSelectedFile(file);
  }, []);

  const onRemoveFile = useCallback(() => {
    setSelectedFile(null);
  }, []);

  return (
    <Modal
      show={modalShow}
      onClose={onModalClose}
      title="Create User"
      width="600px"
    >
      <form>
        <Modal.Body>
          <div className="p-3">
            <div className="form-group">
              <UserProfileChooser 
                onPhotoChange={onPhotoChange} 
                file={selectedFile}
                onRemoveFile={onRemoveFile}
              />
            </div>
            <div className="form-group">
              <Input 
                label="First Name"
                placeholder="First Name"
              />
            </div>
            <div className="form-group">
              <Input 
                label="Last Name"
                placeholder="Last Name"
              />
            </div>
            <div className="form-group">
              <Input 
                label="Email Address"
                placeholder="Email Address"
              />
            </div>
            <div className="form-group">
              <Input 
                label="Contact Number"
                placeholder="Contact Number"
              />
            </div>
            <div className="form-group">
              <Input 
                label="Password"
                placeholder="Password"
              />
            </div>
            <div className="form-group mb-0">
              <Input 
                label="Confirm Password"
                placeholder="Confirm Password"
              />
            </div>
          </div>
        </Modal.Body>
        <ModalFooter onModalClose={onModalClose} />
      </form>
    </Modal>
  );
}

const UserProfileChooser = ({ onPhotoChange, file, onRemoveFile }) => {
  const image = file ? URL.createObjectURL(file) : null;

  return (
    <div className="d-flex justify-content-center">
      <PhotoChooserWrapper>
        {image && (
          <PhotoChooser className="mb-0" image={image} />
        )}
        <span title="Remove" className={`${!image ? 'd-none' : ''} close-image`} onClick={onRemoveFile}>
          <FaTimes />
        </span>
      </PhotoChooserWrapper>
      <PhotoChooser className="mb-0" htmlFor="photo-chooser">
        {!image ? <AiOutlineCloudUpload /> : <AiOutlineEdit />}
        <span>
          {!image ? 'Upload' : 'Change'} Photo
        </span>
        <input 
          type="file" 
          id="photo-chooser" 
          accept="image/png,image/jpg,image/jpeg" 
          className="d-none"
          onChange={onPhotoChange}
        />
      </PhotoChooser>
    </div>
  );
}

const ModalFooter = ({ onModalClose }) => {
  return (
    <Modal.Footer>
      <div className="d-flex justify-content-end">
        <button type="button" className="btn btn-light mr-2" onClick={onModalClose}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </div>
    </Modal.Footer>
  )
}

export default Create;