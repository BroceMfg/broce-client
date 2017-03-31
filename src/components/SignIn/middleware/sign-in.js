module.exports = function signIn(e) {
  this.setState({ loading: true });
  this.props.submit(
    e,
    '/users/login',
    (resp) => {
      this.setState({ loading: false });
      if (!resp.success) {
        if (resp.message.includes('wrong')) {
          this.props.toggleMessage('Invalid Username or Password.', 'error');
        } else {
          this.props.toggleMessage(null, 'error');
        }
      } else {
        this.props.setStateVal({
          user: resp.user,
          admin: this.isAdmin(resp.user)
        });
      }
    }
  );
  // const apiUrl = this.props.apiUrl;
  // e.preventDefault();
  // const email = this.email.value;
  // const password = this.password.value;

  // const data = { email, password };

  // let formData = '';
  // Object.keys(data).forEach(key => {
  //   formData += `${key}=${data[key]}&`;
  // });

  // // just testing post and get out
  // post(
  //   `${apiUrl}/users/login`,
  //   formData,
  //   (response) => {

  //   },
  //   (err) => {
  //     console.log(err)
  //     this.props.toggleMessage(
  //       'An unexpected error occurred.',
  //       'error'
  //     );
  //   }
  // );
};
