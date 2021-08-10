import { Input } from 'components/Forms'
import React from 'react'
import { LoginWrapper, LoginContent } from './login.style'
import axios from 'axios'
import { useDispatch, connect } from 'react-redux'
import { useHistory, Link, Redirect } from 'react-router-dom'

export const Index = ({ access_token }) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const [disabledSubmit, setDisabledSubmit] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState(null)
  const [successMessage, setSuccessMessage] = React.useState(null)

  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')

  const handleLogin = React.useCallback(async (e) => {
    e.preventDefault()
    setDisabledSubmit(true)
    setSuccessMessage(null)
    setErrorMessage(null)
    const formData = new FormData(e.target)
    const payload = {}
    for (const [key, value] of formData.entries()) {
      payload[key] = value
    }
    try {
      const { data } = await axios.post('/api/user/register', payload)
      if (data.success === true) {
        setDisabledSubmit(false)
        setSuccessMessage("User's added successfully!")
        setName('')
        setEmail('')
        setPassword('')
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

  if (!access_token) {
    return <Redirect to="/login" />
  }

  return (
    <LoginWrapper>
      <LoginContent>
        <form onSubmit={handleLogin}>
          <h4 className="mb-4">Add New User</h4>
          <div className="form-group">
            <Input type="text" placeholder="Name"  name="name" required 
              onChange={e => setName(e.target.value)}
              value={name}
            />
          </div>
          <div className="form-group">
            <Input type="email" placeholder="Email"  name="email" required 
              onChange={e => setEmail(e.target.value)}
              value={email}
            />
          </div>
          <div className="form-group">
            <Input type="password" name="password" placeholder="Password" required 
              minLength="5"
              onChange={e => setPassword(e.target.value)}
              value={password}
            />
          </div>
          {errorMessage && <div className="form-group text-danger">{errorMessage}</div>}
          {successMessage && <div className="form-group text-success">{successMessage}</div>}
          <div className="d-flex align-items-center justify-content-between">
            <Link to="/">Home</Link>
            <button type="submit" className="btn btn-primary" disabled={disabledSubmit}>Register</button>
          </div>
        </form>
      </LoginContent>
    </LoginWrapper>
  )
}

const mapStateToProps = state => ({
  access_token: state.auth.access_token
})

export default connect(mapStateToProps)(Index)
