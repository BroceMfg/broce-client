/**
 * Check the role of a user
 * @param {Object} u - An Object representing a user of the application
 */
function getRole(u) {
  if (u && u.role) {
    return this.props.uRoleTypes[u.role];
  }
  return this.props.defURole;
}

/**
 * Check if a user is an admin
 * NOTE: this function exists mainly to account for the possiblility of
 * wanting to add more criteria to a user being an admin in the future.
 * Those additional criteria checks could be performed in this function.
 * @param {Object} u - An Object representing a user of the application
 */
module.exports = function isAdmin(u) {
  return u ? getRole.call(this, u) === 'admin' : false;
};
