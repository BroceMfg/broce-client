import React, { PropTypes } from 'react';

import '../../../css/components/Confirmation.css';

const Confirmation = props => (
  <div className="Confirmation">
    <div className="message-wrapper">
      {props.message}
    </div>
    <div className="buttons-wrapper">
      <button
        id="confirmation-cancel-button"
        onClick={props.cancel}
      >No, Cancel</button>
      <button
        id="confirmation-submit-button"
        onClick={props.submit}
      >Yes, Continue</button>
    </div>
  </div>
);

export default Confirmation;

Confirmation.propTypes = {
  cancel: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
  submit: PropTypes.func.isRequired
};
