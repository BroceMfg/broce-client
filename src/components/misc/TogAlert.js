import React, { PropTypes } from 'react';

import '../../css/components/TogAlert.css';

const TogAlert = props => (
  <div className={`TogAlert ${(props.msg !== '' && props.status !== '') ? 'shown' : 'hidden'} `}>
    <div className="inner">
      <div className={`content ${props.status}`}>
        <span>{props.msg}</span>
        <div className="button-wrapper">
          <button onClick={props.dismiss}>
            <span><i className="mdi mdi-close" /></span>
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default TogAlert;

TogAlert.propTypes = {
  msg: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  dismiss: PropTypes.func.isRequired,
};
