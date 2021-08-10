import React from 'react'
import { connect, useDispatch } from 'react-redux'
import { useParams, Switch, HashRouter, Route, NavLink, Redirect } from 'react-router-dom'
import styled from 'styled-components'
import Box from 'components/Box'
import * as style from './index.style'
import Home from './Home'
import Deposit from './Deposit'
import Edit from './Edit'
import { useHttp } from 'hooks'
import { getDetails } from 'store/reducer/studentDetails'
import { allDeposit } from 'store/reducer/depositReducer'
import PaymentLists from './PaymentLists'

export const Index = ({ match }) => {
  const { studentId } = useParams()
  const dispatch = useDispatch()
  const http = useHttp()

  React.useEffect(() => {
    let unmount = true
    if (unmount) {
      (async () => {
        dispatch( getDetails({ isFetching: true }) )
        const { data } = await http.get(`/api/student/${studentId}`)
        if (unmount) {
          dispatch( getDetails({ studentDetails: data, isFetching: false }) )
        }
      })()
    }
    return () => unmount = false
  }, [studentId, dispatch])

  React.useEffect(() => {
    let unmount = true
    if (unmount) {
      (async () => {
        const { data } = await http.get(`/api/student/${studentId}/deposit`)
        if (unmount) {
          dispatch( allDeposit(data) )
        }
      })()
    }
    return () => unmount = false
  }, [studentId, dispatch])

  return (
    <MainWrapper>
      <Box title="Details" backPath="/student">
        <HashRouter basename="/">
          <div className="row">
            <div className="col-md-2 pl-0">
              <style.LinkWrapper className="border-right p-3">
                <NavLink to="/home">Student Info</NavLink>
                <NavLink to="/edit">Edit Info</NavLink>
                <NavLink to="/payment-lists">Payment Lists</NavLink>
                <NavLink to="/deposits">Deposits</NavLink>
              </style.LinkWrapper>
            </div>
            <div className="col-md-10">
              <Switch>
                <Route path={`/payment-lists`} component={PaymentLists} />
                <Route path={`/deposits`} component={Deposit} />
                <Route exact path={`/edit`} component={Edit} />
                <Route exact path={`/home`} component={Home} />
                <Redirect from="/" to="/home" />
              </Switch>
            </div>
          </div>
        </HashRouter>
      </Box>
    </MainWrapper>
  )
}

const mapStateToProps = (state) => ({})
export default connect(mapStateToProps)(Index)


const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
