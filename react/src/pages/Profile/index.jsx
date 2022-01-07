import React, { useState, useRef, useEffect } from 'react';
import Box from 'components/Box';
import { Input } from 'components/Forms';
import { UserProfileChooser } from 'pages/Users/Edit';
import ChangePassword from './ChangePassword';

const Profile = () => {
  const [edit, setEdit] = useState(false);
  const [photoBase64, setPhotBase64] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [changePwdShow, setChangePwdShow] = useState(false);

  const onRemoveFile = () => {
    setSelectedFile(null);
    // setUserData({ ...userData, photo: null });
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

  const onAuthProfileSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = {};
    payload['photoBase64'] = photoBase64 ? photoBase64.split(',')[1] : null;
    for (const [key, value] of formData.entries()) {
      payload[key] = value;
    }
  };

  return (
    <>
      <ChangePassword 
        onModalClose={() => setChangePwdShow(false)}
        modalShow={changePwdShow}
      />
      <div className="row">
        <div className="col-md-4">
          <Box 
            hasBackBtn={false}
            title="Profile Picture"  
          >
            <div className='p-3'>
              <UserProfileChooser 
                onPhotoChange={onPhotoChange}
                file={selectedFile}
                onRemoveFile={onRemoveFile}
                // userPhoto
              />
            </div>
            <Box.Footer>
              <button 
                type="button" 
                className="btn btn-light w-100"
                onClick={() => setChangePwdShow(true)}
              >
                Change Password
              </button>
            </Box.Footer>
          </Box>
        </div>
        <div className="col-md-8">
          <Box 
            hasBackBtn={false}
            title="Basic Info"
            rightHeader={!edit && (
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={() => setEdit(true)}
              >
                Edit
              </button>
            )
            }
          >
            <AuthInfo 
              edit={edit}
              onCancel={() => setEdit(false)}
              onSubmit={onAuthProfileSubmit}
            />
          </Box>
        </div>
      </div>
    </>
  );
}

const AuthInfo = ({ onSubmit, onCancel, edit }) => {
  const firstName = useRef(null);

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
              onClick={onCancel}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
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