import submit from '../../middleware/submit';

/**
 * Check the role of a user
 * @param {Object} u - An Object representing a user of the application
 */
function getRole(u) {
  if (u && u.role) {
    return this.state.uRoleTypes[u.role];
  }
  return this.state.defURole;
}

/**
 * Check if a user is an admin
 * NOTE: this function exists mainly to account for the possiblility of
 * wanting to add more criteria to a user being an admin in the future.
 * Those additional criteria checks could be performed in this function.
 * @param {Object} u - An Object representing a user of the application
 */
function isAdmin(u) {
  return u ? getRole.call(this, u) === 'admin' : false;
}

/**
 * Sign in a user
 * @param {Object} e - The HTML form representing the signIn form
 */
module.exports = function signIn(e) {
  this.loading.on();
  submit.call(
    this,
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
