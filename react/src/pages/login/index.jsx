import { Input } from 'components/Forms'
import React from 'react'
import { LoginWrapper, LoginContent } from './login.style'
import axios from 'axios'
import { useDispatch, connect } from 'react-redux'
import { getAccessToken } from 'store/reducer/authReducer'
import { Redirect, useHistory } from 'react-router-dom'

export const Index = ({ access_token }) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const [disabledSubmit, setDisabledSubmit] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState(null)

  const handleLogin = React.useCallback(async (e) => {
    e.preventDefault()
    setDisabledSubmit(true)
    const formData = new FormData(e.target)
    const payload = {}
    for (const [key, value] of formData.entries()) {
      payload[key] = value
    }
    try {
      const { data } = await axios.post('/api/user/login', payload)
      if (data.success === true) {
        setTimeout(() => {
          dispatch( getAccessToken({ access_token: data.access_token }) )
          history.push('/student')
          setDisabledSubmit(false)
        }, 500)
      } else {
        setDisabledSubmit(false)
        setErrorMessage(data.message)
      }
    }
    catch(err) {
      setDisabledSubmit(false)
      setErrorMessage("Error: " + err.message)
    }
  }, [dispatch, history])

  if (access_token) {
    return <Redirect to="/student" />
  }

  return (
    <LoginWrapper>
      <LoginContent>
        <form onSubmit={handleLogin}>
          <h4 className="mb-4">Login</h4>
          <div className="form-group">
            <Input type="email" placeholder="Email"  name="email" required />
          </div>
          <div className="form-group">
            <Input type="password" name="password" placeholder="Password" required />
          </div>
          {errorMessage && <div className="form-group text-danger">{errorMessage}</div>}
          <div className="text-right">
            <button type="submit" className="btn btn-primary" disabled={disabledSubmit}>Login</button>
          </div>
        </form>
      </LoginContent>
    </LoginWrapper>
  )
}

const mapStateToProps = state => ({
  access_token: state.auth.access_token,
})

export default connect(mapStateToProps)(Index)
