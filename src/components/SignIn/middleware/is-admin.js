/**
 * Check the role of a user
 * @param {Object} u - An Object representing a user of the application
 */
const getRole = (u) => {
  if (u && u.role) {
    return this.state.uRoleTypes[u.role];
  }
  return this.state.defURole;
};

/**
 * Check if a user is an admin
 * NOTE: this function exists mainly to account for the possiblility of
 * wanting to add more criteria to a user being an admin in the future.
 * Those additional criteria checks could be performed in this function.
 * @param {Object} u - An Object representing a user of the application
 */
module.exports = function isAdmin(u) {
  if (!u) {
    return getRole(u) === 'admin';
  }
  return false;
};
