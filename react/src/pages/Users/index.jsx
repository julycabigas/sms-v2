import React, { Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';

const List = React.lazy(() => import('./List'));

function User({ match }) {
  return (
    <>
      <Suspense fallback={<p></p>}>
        <Switch>
          <Route path={`${match.url}/`} component={List} />
        </Switch>
      </Suspense>
    </>
  );
}

export default User;

