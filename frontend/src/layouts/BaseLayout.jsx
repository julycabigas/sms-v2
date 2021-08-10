import React from 'react';
import Header from './Header';

function BaseLayout({ children }) {
  return (
    <div className="container-fluid p-0">
      <Header />
      <main className="container px-3 py-5">
      {children}
      </main>
    </div>
  );
}

export default BaseLayout;
