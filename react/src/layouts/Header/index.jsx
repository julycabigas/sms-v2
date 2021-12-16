import React from 'react'
import { connect, useDispatch } from 'react-redux'
import * as h from 'styled/header'
import { NavLink } from 'react-router-dom'
import { BiSun, BiMoon } from 'react-icons/bi'
import { setTheme } from 'store/reducer/themeReducer'
import Profile from './Profile';
import { TogglerButton } from './header.style';

export const Header = ({ isDark }) => {
  const dispatch = useDispatch()

  return (
    <h.Header>
      <h.Nav className="container">
        <h.Logo>ECOM Academy</h.Logo>
        <div className="links">
          <NavLink to="/student">Students</NavLink>
          <NavLink to="/all-payment-dues">All Payment Dues</NavLink>
          <NavLink to="/plan">Plans</NavLink>
          <NavLink to="/users">Users</NavLink>
        </div>
        <div>

          <div className="d-flex align-items-center">
            <TogglerButton onClick={() => dispatch(setTheme(!isDark))} className="mr-2">
              {isDark ? <BiSun /> : <BiMoon />}
            </TogglerButton>
            <Profile />
          </div>
        </div>
      </h.Nav>
    </h.Header>
  )
}

const mapStateToProps = (state) => ({
  isDark: state.theme.isDark
})
export default connect(mapStateToProps)(Header)

