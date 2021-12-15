import React, { Suspense } from 'react';
import BaseLayout from 'layouts/BaseLayout';
import { Switch, Route } from 'react-router-dom';

const List = React.lazy(() => import('./List'));

function User({ match }) {
  return (
    <BaseLayout>
      <Suspense fallback={<p></p>}>
        <Switch>
          <Route path={`${match.url}/`} component={List} />
        </Switch>
      </Suspense>
    </BaseLayout>
  );
}

export default User;

