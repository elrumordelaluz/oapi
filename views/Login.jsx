import React from 'react';
import DefaultLayout from './layouts/DefaultLayout';

const Login = (props) => {
  return (
    <DefaultLayout {...props}>
      <div className="ae-grid">
        <div className="ae-grid__item item-sm-6 item-sm--offset-3">
          <form action="/login" method="post" id="login">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input 
                type="text" 
                className="form-control" 
                id="username" 
                name="username" 
                placeholder="Username"
                required />
            </div>
            <div className="form-group">
              <label htmlFor="username">Password</label>
              <input 
                type="password" 
                className="form-control" 
                id="password" 
                name="password" 
                placeholder="Password"
                required />
            </div>
          
            <button type="submit" className="btn btn-primary">Log in</button>
          </form>
        </div>
      </div>
    </DefaultLayout>
  );
}

module.exports = Login;
