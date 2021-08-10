import React from 'react'
import { connect, useDispatch } from 'react-redux'
import * as h from 'styled/header'
import Button from 'react-bootstrap/Button'
import { NavLink } from 'react-router-dom'
import axios from 'axios'
import { BiSun, BiMoon } from 'react-icons/bi'
import styled from 'styled-components'
import { setTheme } from 'store/reducer/themeReducer'

export const Header = ({ isDark }) => {
  const dispatch = useDispatch()

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
    <h.Header>
      <h.Nav className="container">
        <h.Logo>ECOM Academy</h.Logo>
        <div className="links">
          <NavLink to="/student">Students</NavLink>
          <NavLink to="/all-payment-dues">All Payment Dues</NavLink>
          <NavLink to="/plan">Plans</NavLink>
        </div>
        <div>

          <div className="d-flex align-items-center">
            <TogglerButton onClick={() => dispatch(setTheme(!isDark))} className="mr-2">
              {isDark ? <BiSun /> : <BiMoon />}
            </TogglerButton>
            <Button onClick={handleLogout}>Logout</Button>
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



const TogglerButton = styled.button`
  border: 0;
  background: transparent;
  height: 40px;
  width: 40px;
  margin-right: 10px;
  font-size: 26px;
  color: var(--text-color);
  display: flex;
  align-items: center;
  justify-content: center;
`

