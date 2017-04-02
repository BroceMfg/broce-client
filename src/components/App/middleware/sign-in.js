import isAdmin from './is-admin';

module.exports = function signIn(e) {
  this.loading.on();
  this.submit(
    e,
    '/users/login',
    (resp) => {
      this.loading.off();
      if (!resp.success) {
        if (resp.message.includes('wrong') || resp.message.includes('email does not exist')) {
          this.toggleMessage('Invalid Username or Password.', 'error');
        } else {
          this.toggleMessage(null, 'error');
        }
      } else {
        this.setStateVal({
          user: resp.user,
          admin: isAdmin.call(this, resp.user)
        });
      }
    }
  );
};
