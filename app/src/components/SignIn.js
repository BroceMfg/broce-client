import React from 'react';
import Input from './Input';
import ToggledMessage from './ToggledMessage';
import { post } from '../middleware/XMLHTTP';

import '../css/components/SignIn.css';

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.postAction = this.postAction.bind(this);
  }

  postAction(e) {
    const apiUrl = this.props.apiUrl;
    e.preventDefault();
    const email = this.email.value;
    const password = this.password.value;

    const data = { email, password };

    let formData = ''
    Object.keys(data).forEach(key => {
      formData += `${key}=${data[key]}&`;
    });

    // just testing post and get out
    post(
      `${apiUrl}/users/login`,
      formData,
      (response) => {
        console.log(JSON.parse(response));
        this.props.setUser(JSON.parse(response).user);
      },
      (err) => {
        console.log(err)
        this.props.toggleMessage('Invalid username or password.', 'error');
      }
    );
  }

  render() {
    const {
      message,
      messageStatusCode,
      toggleMessage
    } = this.props;
    return (
      <div className="SignIn">
        {
          message
            ? 
              <ToggledMessage
                message={message}
                messageStatusCode={messageStatusCode}
                dismiss={() => toggleMessage()}
              />
            : null
        }
        <form onSubmit={this.postAction}>
          <h1>Welcome to Broce Parts</h1>
          <h3>Log In</h3>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <Input
              refProp={(input) => { this.email = input }}
              type="email"
              name={'email'}
              value={this.props.email}
              placeholder="Email"
              submitOnEnter={true}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <Input
              refProp={(input) => { this.password = input }}
              type="password"
              name={'password'}
              value={this.props.password}
              placeholder="Password"
              submitOnEnter={true}
            />
          </div>
          <button className="btn btn-primary" type="submit">Log In</button>
        </form>
        <a href="/forgot">Forgot your password?</a>
      </div>
    )
  }
}

SignIn.contextTypes = {
  router: React.PropTypes.object
}

export default SignIn;
