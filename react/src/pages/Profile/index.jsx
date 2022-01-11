import React, { useState, useRef, useEffect } from 'react';
import Box from 'components/Box';
import { Input } from 'components/Forms';
import { UserProfileChooser } from 'pages/Users/Edit';
import ChangePassword from './ChangePassword';
import { useAuth, useHttp } from 'hooks';
import { setUser } from 'store/reducer/authReducer'
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

const Profile = () => {
  const [edit, setEdit] = useState(false);
  const [photoBase64, setPhotBase64] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [changePwdShow, setChangePwdShow] = useState(false); 
  const http = useHttp();
  const dispatch = useDispatch();
  const [disabledSubmit, setDisabledSubmit] = useState(false);
  const { user } = useAuth();

  const onRemoveFile = () => {
    setSelectedFile(null);
    setPhotBase64(null);
  };

  const onPhotoChange = (e) => {
    const [file] = e.target.files;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const { result } = e.target;
      setPhotBase64(result);
    }
    setSelectedFile(file);
  }

  const onAuthProfileSubmit = async (e) => {
    try {
      e.preventDefault();
      const formData = new FormData(e.target);
      const payload = {};
      payload['photoBase64'] = photoBase64 ? photoBase64.split(',')[1] : null;
      for (const [key, value] of formData.entries()) {
        payload[key] = value;
      }
      setDisabledSubmit(true);
      const { data } = await http.post('/api/user/profile', payload);
      if (data.success) {
        setEdit(false);
        dispatch( setUser(data.profile) );
        toast.success('Profile successfully updated.');
        setDisabledSubmit(false);
      }
    } catch(err) {
      setEdit(false);
      setDisabledSubmit(false);
      toast.error(err.message);
    }
  };

  return (
    <>
      <ChangePassword 
        onModalClose={() => setChangePwdShow(false)}
        modalShow={changePwdShow}
      />
      <div className="row">
        <div className="col-md-4 position-relative">
          {!edit && (
            <div  
              style={{  
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                border: 0,
                background: '#00000008',
                width: '100%',
                height: '100%',
                zIndex: 99,
              }}
            />
          )}
          <Box 
            hasBackBtn={false}
            title="Profile Picture"  
          >
            <div className='p-3'>
              <UserProfileChooser 
                onPhotoChange={onPhotoChange}
                file={selectedFile}
                onRemoveFile={onRemoveFile}
                userPhoto={user && user.photo}
              />
            </div>
          </Box>
        </div>
        <div className="col-md-8">
          <Box 
            hasBackBtn={false}
            title="Basic Info"
            rightHeader={!edit && (
              <div className='d-flex align-items-center'>
                <button 
                  type="button" 
                  className="btn btn-primary mr-2"
                  onClick={() => setEdit(true)}
                  style={{ width: '160px' }}
                >
                  Edit Profile
                </button>
                <button 
                  type="button" 
                  className="btn btn-light w-100"
                  onClick={() => setChangePwdShow(true)}
                >
                  Change Password
                </button>
              </div>
            )
            }
          >
            <AuthInfo 
              edit={edit}
              onCancel={() => setEdit(false)}
              onSubmit={onAuthProfileSubmit}
              disabledSubmit={disabledSubmit}
            />
          </Box>
        </div>
      </div>
    </>
  );
}

const AuthInfo = ({ onSubmit, onCancel, edit, disabledSubmit }) => {
  const firstName = useRef(null);
  const { user } = useAuth();
  const userData = { ...user };
  const [first_name, setFirstName] = useState(userData.first_name || '');
  const [last_name, setLastName] = useState(userData.last_name || '');
  const [email, setEmail] = useState(userData.email || '');
  const [contact_number, setContactNumber] = useState(userData.contact_number || '');

  const _onCancel = () => {
    onCancel();
    setFirstName(userData.first_name || '');
    setLastName(userData.last_name || '');
    setEmail(userData.email || '');
    setContactNumber(userData.contact_number || '');
  }

  useEffect(() => {
    if (edit && firstName && firstName.current) {
      firstName.current.focus();
    }
  }, [edit]);

  return (
    <form onSubmit={onSubmit}>
      <div className="p-3">
        <div className="mb-4">
          <Input 
            label="First Name"
            placeholder="First Name"
            horizontal
            labelWidth="147px"
            labelMargin="0"
            name="first_name"
            readOnly={!edit}
            ref={firstName}
            value={first_name}
            onChange={e => setFirstName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <Input 
            label="Last Name"
            placeholder="Last Name"
            horizontal
            labelWidth="147px"
            labelMargin="0"
            name="last_name"
            readOnly={!edit}
            value={last_name}
            onChange={e => setLastName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <Input 
            label="Email Address"
            placeholder="Email Address"
            horizontal
            labelWidth="147px"
            labelMargin="0"
            type="email"
            name="email"
            readOnly={!edit}
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <Input 
            label="Contact #"
            placeholder="Contact #"
            horizontal
            labelWidth="147px"
            labelMargin="0"
            type="tel"
            name="contact_number"
            readOnly={!edit}
            value={contact_number}
            onChange={e => setContactNumber(e.target.value)}
          />
        </div>
      </div>
      {edit && (
        <Box.Footer>
          <span></span>
          <div>
            <button 
              type="button" 
              className="btn btn-light mr-2" 
              onClick={_onCancel}
              disabled={disabledSubmit}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={disabledSubmit}
            >
              Update
            </button>
          </div>
        </Box.Footer>
      )}
    </form>
  );
}

export default Profile;