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

    let formData = '';
    Object.keys(data).forEach(key => {
      formData += `${key}=${data[key]}&`;
    });

    // just testing post and get out
    post(
      `${apiUrl}/users/login`,
      formData,
      (response) => {
        const resp = JSON.parse(response);
        if (!resp.success) {
          if (resp.message.includes('wrong')) {
            this.props.toggleMessage(
              'Invalid username or password.',
              'error'
            );
          } else {
            this.props.toggleMessage(
              'An unexpected error occurred.',
              'error'
            );
          }
        } else {
          this.props.setUser(resp.user);
        }
      },
      (err) => {
        console.log(err)
        this.props.toggleMessage(
          'An unexpected error occurred.',
          'error'
        );
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
          <div className="form-group">
            <div className="label-wrapper"><label htmlFor="email">Email</label></div>
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
            <div className="label-wrapper"><label htmlFor="password">Password</label></div>
            <Input
              refProp={(input) => { this.password = input }}
              type="password"
              name={'password'}
              value={this.props.password}
              placeholder="Password"
              submitOnEnter={true}
            />
          </div>
          <button className="submit" type="submit">Log In</button>
        </form>
        <a className="forgot" href="/forgot">Forgot your password?</a>
      </div>
    )
  }
}

SignIn.contextTypes = {
  router: React.PropTypes.object
}

export default SignIn;