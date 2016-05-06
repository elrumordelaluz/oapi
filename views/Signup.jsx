import React from 'react';
import DefaultLayout from './layouts/DefaultLayout';

const Signup = (props) => {
  return (
    <DefaultLayout {...props}>
      <h1>Signup</h1>
      <form action="/signup" method="post">
        <input type="text" name="username" className="form-control" placeholder="Username" required autofocus />
        <input type="password" name="password" className="form-control" placeholder="Password" required />
        <button className="btn btn-primary btn-block">Sign up</button>
      </form>
    </DefaultLayout>
  );
}

module.exports = Signup;
