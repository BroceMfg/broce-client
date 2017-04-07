import request from '../../../middleware/request';

/**
 * Mark a notification as seen (no longer will be marked "new")
 * @param {number} orderId - The order id to be marked as seen
 * @param {Object} loading - The loading functions
 */
module.exports = function markSeen(orderId, loading) {
  loading.on();
  request(
    'POST',
    `${this.props.apiUrl}/notifications/seen/${orderId}`,
    undefined,
    (data) => {
      loading.off();
      const notifs = this.props.notifs.map((n) => {
        const notif = n;
        if (notif.OrderId === orderId) {
          notif.new = false;
        }
        return notif;
      });
      this.props.setStateVal({ notifs });
    },
    () => {
      // session expired or possible security vulnerability.
      // log user out and reload
      const errMsg = 'An unexpected error occurred.';
      this.props.setStateVal({ errMsg });
      setTimeout(() => { this.props.logout(); }, 1250);
    }
  );
  console.log(`orderDetail comp loaded with orderId: ${orderId}`);
};
