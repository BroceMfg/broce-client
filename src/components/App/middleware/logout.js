import request from '../../middleware/request';

module.exports = function logout() {
  request(
    'POST',
    `${this.state.apiUrl}/users/logout`,
    undefined,
    () => {
      localStorage.clear();
    },
    (err) => {
      this.setStateVal({ user: undefined });
      this.setStateVal({ errMsg: err });
    }
  );
  // refresh the broswer to unmount/remount our component
  window.location.reload(false);
};
