module.exports = function signIn(e) {
  this.setState({ loading: true });
  this.props.submit(
    e,
    '/users/login',
    (resp) => {
      this.setState({ loading: false });
      if (!resp.success) {
        if (resp.message.includes('wrong') || resp.message.includes('email does not exist')) {
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
};
