import React from 'react'
import { useSelector } from 'react-redux'
import { Route, Redirect } from 'react-router-dom'

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { access_token } = useSelector(state => state.auth)
  return (
    <Route {...rest} render={props => (
      <>
        {access_token ? <Component {...props} /> : <Redirect to="/login" />}
      </>
    )} />
  )
}

export default PrivateRoute