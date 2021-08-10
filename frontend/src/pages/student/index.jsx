import React from 'react'
import { connect } from 'react-redux'
import { Route, Switch } from 'react-router-dom'
import Create from './Create'
import List from './List'
import View from './View'
import BaseLayout from 'layouts/BaseLayout'

export const Index = ({ match }) => {
  return (
    <BaseLayout>
      <Switch>
        <Route path={`${match.url}/create/:stepId`} component={Create} />
        <Route path={`${match.url}/:studentId`} component={View} />
        <Route path={`${match.url}/`} component={List} />
      </Switch>
    </BaseLayout>
  )
}

const mapStateToProps = (state) => ({})

export default connect(mapStateToProps)(Index)
