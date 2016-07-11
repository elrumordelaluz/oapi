import React from 'react';
import DefaultLayout from './layouts/DefaultLayout';

const Index = (props) => {
  const hasToken = props.currentUser && props.currentUser.token;
  return (
    <DefaultLayout {...props}>
      <h1>
        API Details { !hasToken && <a href="/token" className="btn btn-primary btn-sm">Create Token</a> }
      </h1>

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

      {
        hasToken &&
        <div>
          <p>Your Token</p>
          <pre>
            <code>{props.currentUser.token}</code>
          </pre>
        </div>
      }

      <hr/>

      <a href="/packs" className="btn btn-warning pull-right">Packs</a>
      <a href="/upload" className="btn btn-info">Upload Icon</a>

    </DefaultLayout>
  );
}

module.exports = Index;
