import React, { Suspense } from 'react'
import { connect } from 'react-redux'
import { Route, Switch } from 'react-router-dom'

const Create = React.lazy(() => import('./Create'));
const List = React.lazy(() => import('./List'));
const View = React.lazy(() => import('./View'));

export const Index = ({ match }) => {
  return (
    <>
      <Suspense fallback={<p></p>}>
        <Switch>
          <Route path={`${match.url}/create/:stepId`} component={Create} />
          <Route path={`${match.url}/:studentId`} component={View} />
          <Route path={`${match.url}/`} component={List} />
        </Switch>
      </Suspense>
    </>
  )
}

const mapStateToProps = (state) => ({})

export default connect(mapStateToProps)(Index)
