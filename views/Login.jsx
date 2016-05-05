import React from 'react';
import DefaultLayout from './layouts/DefaultLayout';

const Login = (props) => {
  return (
    <DefaultLayout {...props}>
      <h1>Log in</h1>
      <form action="/login" method="post">
        <input type="text" name="username" className="form-control" placeholder="Username" required autofocus />
        <input type="password" name="password" className="form-control" placeholder="Password" required />
        <button className="btn btn-primary btn-block">Log in</button>
      </form>
    </DefaultLayout>
  );
}

module.exports = Login;
