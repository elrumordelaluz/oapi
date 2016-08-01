import React, { Component } from 'react';
import Header from './Header';
import Main from './Main';

class DefaultLayout extends Component {
  render () {
    return (
      <html>
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>{ this.props.title }</title>
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" />
          <link rel="stylesheet" href="https://cdn.rawgit.com/bootstrap-tagsinput/bootstrap-tagsinput/master/dist/bootstrap-tagsinput.css"/>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/aurora-grid/1.0.6/aurora-grid.min.css"/>
          <link rel="stylesheet" href="/css/style.css"/>
          <link rel="stylesheet" href="/css/prism.css"/>
        </head>
        <body>
          <Header {...this.props} />
          <Main>
            { this.props.children }
          </Main>
          <script src="https://code.jquery.com/jquery-2.2.4.min.js"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.13.1/lodash.min.js"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-validate/1.15.0/jquery.validate.min.js"></script>
          <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-tagsinput/0.8.0/bootstrap-tagsinput.min.js"></script>
          <script src="/js/jquery.auto-grow-input.min.js"></script>
          <script src="/js/prism.js"></script>
          <script src="/js/main.js"></script>
        </body>
      </html>
    );
  }
}

module.exports = DefaultLayout;
