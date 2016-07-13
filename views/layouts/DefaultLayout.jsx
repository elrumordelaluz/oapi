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
          <link rel="stylesheet" href="https://cdn.rawgit.com/bootstrap-tagsinput/bootstrap-tagsinput/master/dist/bootstrap-tagsinput.css"/>
          <link rel="stylesheet" href="/css/aurora-grid.css"/>
          <link rel="stylesheet" href="/css/style.css"/>
        </head>
        <body>
          <Header {...this.props} />
          <Main>
            { this.props.children }
          </Main>
          <script src="https://code.jquery.com/jquery-2.2.4.min.js"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-validate/1.15.0/jquery.validate.min.js"></script>
          <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-tagsinput/0.8.0/bootstrap-tagsinput.min.js"></script>
          <script src="/js/main.js"></script>
        </body>
      </html>
    );
  }
}

module.exports = DefaultLayout;
