import React from 'react';
import autoBind from 'react-autobind';

import isAdm from './middleware/is-admin';
import signIn from './middleware/sign-in';

import Input from '../Input';
import ToggledMessage from '../ToggledMessage';
import Loading from '../misc/Loading';

import '../../css/components/SignIn.css';

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.isAdmin = isAdm.bind(this);
    this.submit = signIn.bind(this);
    autoBind(this);
    this.state = {
      loading: false
    };
  }

  setUser(user) {
    this.setState({
      ...this.state,
      user,
      admin: this.isUAdm(user)
    });
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
          this.state.loading
            ?
              <div className="SignIn-loading-wrapper">
                <Loading />
              </div>
            :
              <div>
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
                <form onSubmit={this.submit}>
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
        }
      </div>
    )
  }
}

SignIn.contextTypes = {
  router: React.PropTypes.object
}

export default SignIn;
