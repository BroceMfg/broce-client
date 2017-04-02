module.exports = function logout() {
  localStorage.clear();
  this.request(
    'POST',
    `${this.state.apiUrl}/users/logout`,
    undefined,
    this.noop,
    (err) => {
      this.setStateVal({ errMsg: err });
    }
  );
  // refresh the broswer to unmount/remount our component
  window.location.reload(false);
};
