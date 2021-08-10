import React from 'react';
import './App.css';
import Plan from 'pages/plan';
import Student from 'pages/student';
import AllPaymentDues from 'pages/all-payment-dues';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import Login from 'pages/login'
import Register from 'pages/register'
import PrivateRoute from 'components/PrivateRoute'
import { useSelector } from 'react-redux'

const [html] = document.getElementsByTagName('html')

function App() {
  const { isDark } = useSelector(state => state.theme)

  React.useEffect(() => {
    if (isDark) {
      html.setAttribute('dark', 'true')
    } else {
      html.removeAttribute('dark')
    }
  }, [isDark])

  return (
    <BrowserRouter>
      <Switch>
        <PrivateRoute path="/plan" component={Plan} />
        <PrivateRoute path="/student" component={Student} />
        <PrivateRoute path="/all-payment-dues" component={AllPaymentDues} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Redirect from="/" to="/student" />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
