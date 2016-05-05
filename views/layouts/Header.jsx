import React from 'react';

const Header = (props) => {
  const navigation = props.currentUser ?
    (
      <ul className="nav navbar-nav navbar-right">
        <li><a href="/edit">Hello, {props.currentUser.name} </a></li>
        <li><a href="/logout">Log out</a></li>
      </ul>
    ) : (
      <ul className="nav navbar-nav navbar-right">
        <li><a href="/login">Log in</a></li>
        <li><a href="/signup">Sign up</a></li>
      </ul>
    );

  const renderAlert = (type, msg) => <div className={`alert alert-${type}`} role="alert">{msg}</div>;

  return (
    <div>
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
    </div>
  );
}

export default Header;
