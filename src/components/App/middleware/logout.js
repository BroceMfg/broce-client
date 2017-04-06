import request from '../../middleware/request';

module.exports = function logout() {
  localStorage.clear();
  request(
    'POST',
    `${this.state.apiUrl}/users/logout`,
    undefined,
    () => {},
    (err) => {
      this.setStateVal({ errMsg: err });
    }
  );
  // refresh the broswer to unmount/remount our component
  window.location.reload(false);
};
