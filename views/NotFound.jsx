import React from 'react';
import DefaultLayout from './layouts/DefaultLayout';

const NotFound = (props) => {
  return (
    <DefaultLayout {...props}>
      <h1>Page Not Found</h1>
    </DefaultLayout>
  );
}

module.exports = NotFound;
