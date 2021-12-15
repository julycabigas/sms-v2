import React, { useState, useCallback } from 'react';
import Modal from 'components/Modal';
import { AiOutlineCloudUpload, AiOutlineEdit } from 'react-icons/ai';
import { FaTimes } from 'react-icons/fa';
import { PhotoChooser, PhotoChooserWrapper } from './create.style';
import { Input } from 'components/Forms';
import { toast } from 'react-toastify';  
import { useHttp } from 'hooks';
import { useDispatch } from 'react-redux';
import { addUser } from 'store/reducer/userReducer';

function Create({ modalShow, onModalClose }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const http = useHttp();
  const [photoBase64, setPhotBase64] = useState(null);
  const dispatch = useDispatch();
  const [disabledBtn, setDisabledBtn] = useState(false);

  const onPhotoChange = useCallback((ev) => {
    const [file] = ev.target.files;
    const reader = new FileReader();
    setSelectedFile(file);
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const { result } = e.target;
      setPhotBase64(result);
    }
  }, []);

  const onCreateUser = async (e) => {
    e.preventDefault();
    setDisabledBtn(true);
    const formData = new FormData(e.target);
    const payload = {};
    if (password !== confirmPassword) {
      toast.warning('Password does not match.');
      return;
    }
    for (const [key, value] of formData.entries()) {
      payload[key] = value;
    }
    payload['photo'] = photoBase64 ? photoBase64.split(',')[1] : null;
    payload['password'] = password;
    const { data } = await http.post('/api/user/register', payload);
    if (data.success === true) {
      dispatch( addUser(data.user) );
      setDisabledBtn(false);
      onModalClose();
      toast.success('User added successfully.');
    } else {
      setDisabledBtn(false);
      toast.error(data.message);
    }
  };

  const onRemoveFile = useCallback(() => {
    setSelectedFile(null);
  }, []);

  return (
    <Modal
      show={modalShow}
      onClose={onModalClose}
      title="Create User"
      width="600px"
      allowClickOutside={false}
    >
      <form onSubmit={onCreateUser}>
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
              <div className="row">
                <div className="col-md-6">
                  <Input 
                    label="First Name"
                    placeholder="First Name"
                    name="first_name"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <Input 
                    label="Last Name"
                    placeholder="Last Name"
                    name="last_name"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="form-group">
              <Input 
                label="Email Address"
                placeholder="Email Address"
                name="email"
                required
              />
            </div>
            <div className="form-group">
              <Input 
                label="Contact Number"
                placeholder="Contact Number"
                name="contact_number"
                required
              />
            </div>
            <div className="form-group">
              <Input 
                label="Password"
                placeholder="Password"
                onChange={e => setPassword(e.target.value)}
                value={password}
                required
                type="password"
                minLength={3}
              />
            </div>
            <div className="form-group mb-0">
              <Input 
                label="Confirm Password"
                placeholder="Confirm Password"
                onChange={e => setConfirmPassword(e.target.value)}
                value={confirmPassword}
                required
                type="password"
                minLength={3}
              />
            </div>
          </div>
        </Modal.Body>
        <ModalFooter onModalClose={onModalClose} disabledBtn={disabledBtn} />
      </form>
    </Modal>
  );
}

const UserProfileChooser = React.memo(({ onPhotoChange, file, onRemoveFile }) => {
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
});

const ModalFooter = ({ onModalClose, disabledBtn }) => {
  return (
    <Modal.Footer>
      <div className="d-flex justify-content-end">
        <button type="button" className="btn btn-light mr-2" onClick={onModalClose} disabled={disabledBtn}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={disabledBtn}>
          Submit
        </button>
      </div>
    </Modal.Footer>
  )
}

export default Create;