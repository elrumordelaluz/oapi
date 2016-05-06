import React, { Component } from 'react';
import Header from './Header';
import Main from './Main';

class DefaultLayout extends Component {
  render () {
    return (
      <html>
        <head>
          <meta charSet="utf-8" />
          <title>{ this.props.title }</title>
          <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" />
        </head>
        <body>
          <Header {...this.props} />
          <Main>
            { this.props.children }
          </Main>
        </body>
      </html>
    );
  }
}

module.exports = DefaultLayout;
