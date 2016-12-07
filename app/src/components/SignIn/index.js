import React from 'react';
import fetch from 'isomorphic-fetch';
import Input from '../Input';

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.postAction = this.postAction.bind(this);
  }

  postAction(e) {
    e.preventDefault();
    const email = this.email.value;
    const password = this.password.value;

    fetch(`${this.props.apiUrl}/users/login`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      method: 'POST',
      body: JSON.stringify({
        email,
        password
      })
    })
    .then((res) => {
      console.log(res);
      console.log(res.headers._headers['set-cookie'][0].split(';')[0]);
    })
    .then((data) => {
      if (!data.success || !data.user) {
        console.log('error');
      }
      console.log(data);
    });

    // axios.post(`${this.props.apiUrl}/users/login`, {
    //   email,
    //   password
    // })
    // .then(function (response) {
    //   console.log(response);
    //   console.log(response.headers._headers['set-cookie'][0].split(';')[0])
    // })
    // .catch(function (error) {
    //   console.log(error);
    // });
  }

  render() {
    return (
      <div className="SignIn">
        <form onSubmit={this.postAction}>
          <legend>Log In</legend>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <Input 
              refProp={(input) => { this.email = input }}
              type="email"
              name={'email'}
              value={this.props.email}
              placeholder="Email"
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
            />
          </div>
          <button className="btn btn-primary" type="submit">Log In</button>
        </form>
        <a href="/forgot">Forgot your password?</a>
      </div>
    )
  }
}

export default SignIn;