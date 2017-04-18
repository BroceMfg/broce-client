import request from '../../../middleware/request';

/**
 * Get the user's notifications from the API
 */
module.exports = function fetchNotifs(loading) {
  loading.on();
  request(
    'GET',
    `${this.props.apiUrl}/notifications`,
    undefined,
    (data) => {
      const json = JSON.parse(data);
      loading.off();
      if (json.foundNotifs) {
        this.props.setStateVal({ notifs: json.foundNotifs });
      } else {
        this.props.toggleMessage('Error fetching notifications', 'error');
      }
    },
    () => {
      // session expired or possible security vulnerability.
      // log user out and reload
      const errMsg = 'An unexpected error occurred.';
      this.props.setStateVal({ errMsg });
      setTimeout(() => { this.props.logout(); }, 1250);
    }
  );
};
