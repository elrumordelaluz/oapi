import React from 'react';
import DefaultLayout from './layouts/DefaultLayout';

const Index = (props) => {
  return (
    <DefaultLayout {...props}>
      <h1>API Details</h1>

    <p>Get single Icon</p>
      <pre>
        <code>
          http://orion-url.com/api/v1/icon/(:id|:slug)?token=yourToken
        </code>
      </pre>

      <p>Get Icons by Package</p>
      <pre>
        <code>
          http://orion-url.com/api/v1/package/:package?token=yourToken
        </code>
      </pre>

      <p>Get Icons by Query</p>
      <pre>
        <code>
          http://orion-url.com/api/v1/search/:query?nin=nin&token=yourToken
        </code>
      </pre>
    </DefaultLayout>
  );
}

module.exports = Index;
