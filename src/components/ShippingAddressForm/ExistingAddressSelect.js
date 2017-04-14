import React, { PropTypes } from 'react';

const ExistingAddressSelect = props => (
  <div className="ExistingAddressSelect">
    <h4>Select An Existing Address</h4>
    <select
      name="shipping-address-select"
      defaultValue="none"
      onChange={props.onChange}
    >
      <option value="none">--</option>
      {
        props.addresses.map((addr, i) => (
          <option key={Math.random()} value={i}>
            {`${addr.street} ${addr.city}, ${addr.state}`}
          </option>
        ))
      }
    </select>
  </div>
);

export default ExistingAddressSelect;

ExistingAddressSelect.propTypes = {
  addresses: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  onChange: PropTypes.func.isRequired
};
