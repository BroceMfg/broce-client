import React, { PropTypes } from 'react';

const ExistingAddressSelect = props => (
  <div className="ExistingAddressSelect">
    <h4 className="existing-address-header">Select An Existing Address</h4>
    <select
      className="existing-address-select"
      name="existing-address-select"
      defaultValue={props.originalValue}
      onChange={props.onChange}
    >
      <option value={-1}>Select an Existing Address</option>
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
  onChange: PropTypes.func.isRequired,
  originalValue: PropTypes.string
};

ExistingAddressSelect.defaultProps = {
  originalValue: '-1'
};
