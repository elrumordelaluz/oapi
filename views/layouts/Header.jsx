import React from 'react';

const Header = (props) => {
  const navigation = props.currentUser ?
    (
      <ul className="nav navbar-nav navbar-right">
        <li><a>Hello, {props.currentUser.username}</a></li>
        <li><a href="/logout">Log out</a></li>
        {props.currentUser.admin && (
          <li><a href="/admin">[Admin]</a></li>
        ) }
      </ul>
    ) : (
      <ul className="nav navbar-nav navbar-right">
        <li><a href="/signup">Sign up</a></li>
        <li><a href="/login">Log in</a></li>
      </ul>
    );

  const renderAlert = (type, msg) => (
    <div key={msg} className={`alert alert-${type}`} role="alert">
      <span dangerouslySetInnerHTML={{__html: msg}} />
      <button type="button" className="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  );

  return (
    <header id="top">
      <div className="navbar navbar-default navbar-static-top" role="navigation">
        <div className="container">
          <div className="navbar-header">
            <a className="navbar-brand" href="/">{props.title}</a>
          </div>
          {navigation}
        </div>
      </div>
      <div className="container">
        { props.errors && props.errors.map(error => renderAlert('danger', error) )}
        { props.infos && props.infos.map(info => renderAlert('info', info) )}
      </div>
    </header>
  );
}

export default Header;
