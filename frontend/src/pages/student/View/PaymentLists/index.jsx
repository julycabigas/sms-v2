import React from 'react'
import { connect } from 'react-redux'
import { Switch, Route } from 'react-router-dom'
import AddPayment from './AddPayment'
import List from './List'

export const Index = ({ match }) => {
  return (
    <div className="pt-4 pb-4">
      <Switch>
        <Route exact path={`${match.url}/add`}>
          <AddPayment match={match} />
        </Route>
        <Route exact path={match.url} component={List} />
      </Switch>
    </div>
    
  )
}

const mapStateToProps = (state) => ({})


export default connect(mapStateToProps)(Index)
