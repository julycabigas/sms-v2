import React from 'react';
import Header from './Header';
import { useSelector } from 'react-redux'

function BaseLayout({ children }) {
  const { access_token } = useSelector(state => state.auth)

  if (!access_token) {
    return <>{children}</>
  }

  return (
    <div className="container-fluid p-0">
      <Header />
      <main className="container px-3 py-5 page-manager">
      {children}
      </main>
    </div>
  );
}

export default BaseLayout;
