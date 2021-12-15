import React, { useState, useCallback, useEffect } from 'react';
import Modal from 'components/Modal';
import { AiOutlineCloudUpload, AiOutlineEdit } from 'react-icons/ai';
import { FaTimes } from 'react-icons/fa';
import { PhotoChooser, PhotoChooserWrapper } from './create.style';
import { Input } from 'components/Forms';
import { toast } from 'react-toastify';  
import { useHttp } from 'hooks';
import { useDispatch } from 'react-redux';
import { updateUser } from 'store/reducer/userReducer';

function Edit({ userId, modalShow, onModalClose }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const http = useHttp();
  const [photoBase64, setPhotBase64] = useState(null);
  const dispatch = useDispatch();
  const [disabledBtn, setDisabledBtn] = useState(false);
  const [userData, setUserData] = useState(null);

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

  const onUpdateUser = async (e) => {
    e.preventDefault();
    setDisabledBtn(true);
    const formData = new FormData(e.target);
    const payload = {};
    for (const [key, value] of formData.entries()) {
      payload[key] = value;
    }
    payload['photoBase64'] = photoBase64 ? photoBase64.split(',')[1] : null;
    const { data } = await http.put('/api/user/' + userId, payload);
    if (data.success) {
      dispatch( updateUser({ updatedUser: data.user, userId }) );
      setDisabledBtn(false);
      onModalClose();
      toast.success('User updated successfully.');
    }
  };

  const onRemoveFile = useCallback(() => {
    setSelectedFile(null);
    setUserData({ ...userData, photo: null });
  }, []);

  useEffect(() => {
    (async () => {
      setUserData(null);
      const { data } = await http.get('/api/user/' + userId);
      setUserData(data);
    })();
  }, []);

  return (
    <Modal
      show={modalShow}
      onClose={onModalClose}
      title="Update User"
      width="500px"
      allowClickOutside={false}
    >
      {!userData ? (
        <p className="text-center my-3">Loading...</p>
      ) : (
        <form onSubmit={onUpdateUser}>
          <Modal.Body>
            <div className="p-3">
              <div className="form-group">
                <UserProfileChooser 
                  onPhotoChange={onPhotoChange} 
                  file={selectedFile}
                  onRemoveFile={onRemoveFile}
                  userPhoto={userData.photo || null}
                />
              </div>
              <div className="form-group">
                <div className="row">
                  <div className="col-md-6">
                    <Input 
                      label="First Name"
                      placeholder="First Name"
                      name="first_name"
                      defaultValue={userData.first_name || ''}
                    />
                  </div>
                  <div className="col-md-6">
                    <Input 
                      label="Last Name"
                      placeholder="Last Name"
                      name="last_name"
                      defaultValue={userData.last_name || ''}
                    />
                  </div>
                </div>
              </div>
              <div className="form-group">
                <Input 
                  label="Email Address"
                  placeholder="Email Address"
                  name="email"
                  defaultValue={userData.email || ''}
                />
              </div>
              <div className="form-group mb-0">
                <Input 
                  label="Contact Number"
                  placeholder="Contact Number"
                  name="contact_number"
                  defaultValue={userData.contact_number || ''}
                />
              </div>
            </div>
          </Modal.Body>
          <ModalFooter onModalClose={onModalClose} disabledBtn={disabledBtn} />
        </form>
      )}
    </Modal>
  );
}

const UserProfileChooser = React.memo(({ onPhotoChange, file, onRemoveFile, userPhoto }) => {
  const image = () => {
    if (file) {
      return URL.createObjectURL(file);
    }
    return userPhoto;
  }

  return (
    <div className="d-flex justify-content-center">
      <PhotoChooserWrapper>
        {image() && (
          <PhotoChooser className="mb-0" image={image()} />
        )}
        <span title="Remove" className={`${!image() ? 'd-none' : ''} close-image`} onClick={onRemoveFile}>
          <FaTimes />
        </span>
      </PhotoChooserWrapper>
      <PhotoChooser className="mb-0" htmlFor="photo-chooser">
        {!image() ? <AiOutlineCloudUpload /> : <AiOutlineEdit />}
        <span>
          {!image() ? 'Upload' : 'Change'} Photo
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
          Update
        </button>
      </div>
    </Modal.Footer>
  )
}

export default Edit;