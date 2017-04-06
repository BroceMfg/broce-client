import React, { PropTypes } from 'react';

import '../../../css/components/SignIn.css';

const SignIn = props => (
  <div className="SignIn">
    <form onSubmit={props.signIn}>
      <h1>Welcome to Broce Parts</h1>
      <div className="form-group">
        <div className="label-wrapper"><label htmlFor="email">Email</label></div>
        <div className="Input">
          <input
            type="email"
            name="email"
            placeholder="Email"
          />
        </div>
      </div>
      <div className="form-group">
        <div className="label-wrapper"><label htmlFor="password">Password</label></div>
        <div className="Input">
          <input
            type="password"
            name="password"
            placeholder="Password"
          />
        </div>
      </div>
      <button className="submit" type="submit">Log In</button>
    </form>
    <a className="forgot" href="/forgot">Forgot your password?</a>
  </div>
);

export default SignIn;

SignIn.propTypes = {
  signIn: PropTypes.func.isRequired,
};
