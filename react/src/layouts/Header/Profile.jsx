import React from 'react';
import { ImageProfile, ProfileInner, ProfileLinkWrapper } from './header.style';
import axios from 'axios'

const Profile = () => {
  const [open, setOpen] = React.useState(false);

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

  return (
    <div className="position-relative" style={{ zIndex: 2 }}>
      <div onClick={() => setOpen(!open)}>
        <ImageProfile
          src="https://lh3.googleusercontent.com/ogw/ADea4I6ekOayklfSxkWogyQZhIzjs04ED04qMY1CpC6CDQ=s32-c-mo"
          size="40px"
        />
      </div>
      {open && (
        <ProfileInner>
          <div className="p-2 d-flex" style={{ borderBottom: '1px solid var(--border-color)' }}>
            <ImageProfile
              src="https://lh3.googleusercontent.com/ogw/ADea4I6ekOayklfSxkWogyQZhIzjs04ED04qMY1CpC6CDQ=s32-c-mo"
              size="50px"
            />
            <div className="ml-2 d-flex flex-column">
              <span className="font-weight-500">Joemy Jay Flores</span>
              <span className="small">jayflores139@gmail.com</span>
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