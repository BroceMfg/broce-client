import request from '../../../middleware/request';

// Fetch the existing shipping addresses (if any) related to the current user.
module.exports = function fetchAddresses(loading) {
  loading.on();
  request(
    'GET',
    `${this.props.apiUrl}/users/addresses`,
    undefined,
    (data) => {
      const json = JSON.parse(data);
      const addresses = json.addresses;
      this.props.setStateVal({ addresses });
      loading.off();
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
