import React from 'react';
import { ImageProfile, ProfileInner, ProfileLinkWrapper } from './header.style';
import axios from 'axios'
import noProfile from 'images/no-profile.png';
import { useAuth } from 'hooks';

const Profile = () => {
  const [open, setOpen] = React.useState(false);
  const { user } = useAuth();
  const profileInnerRef = React.useRef(null);

  const handleLogout = async () => {
    try {
      const {data} = await axios.post('/api/user/logout')
      if (data.success === true) {
        setTimeout(() => {
          window.location.reload()
        }, 100)
      }
    }
    catch(err) {
      console.log(err)
    }
  }

  React.useEffect(() => {
    const windowClick = (e) => {
      if (!open) return;
      if ((profileInnerRef && profileInnerRef.current) && !(e.target === profileInnerRef.current || profileInnerRef.current.contains(e.target))) {
        setOpen(false);
      }
    }
    window.addEventListener('click', windowClick);
    return () => {
      window.removeEventListener('click', windowClick);
    }
  }, [open]);

  return (
    <div className="position-relative" style={{ zIndex: 2 }}>
      <div onClick={() => setOpen(!open)}>
        <ImageProfile
          src={user && (user.photo || noProfile)}
          size="40px"
        />
      </div>
      {open && (
        <ProfileInner ref={profileInnerRef}>
          <div className="p-2 d-flex flex-column align-items-center" style={{ borderBottom: '1px solid var(--border-color)' }}>
            <ImageProfile
              src={user && (user.photo || noProfile)}
              size="50px"
            />
            <div className="mt-2 d-flex flex-column align-items-center">
              <span className="font-weight-500">
                {user && user.name}
              </span>
              <span className="small">{user && user.email}</span>
            </div>
          </div>
          <ProfileLinkWrapper className="d-flex flex-column py-2">
            <a>Profile</a>
            <button type="button" onClick={handleLogout}>Logout</button>
          </ProfileLinkWrapper>
        </ProfileInner>
      )}
    </div>
  );
}

export default React.memo(Profile);