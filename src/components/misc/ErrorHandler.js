import React, { PropTypes } from 'react';

const ErrorHandler = props => (
  <div className="ErrorHandler">
    <div className="inner">
      <div className="oops-header-wrapper">
        <h1>Oops... It appears an error occurred.</h1>
      </div>
      <div className="err-msg-wrapper">
        {
          props.log && props.msg
            ? <span>{props.msg}</span>
            : <span>{props.def}</span>
        }
      </div>
    </div>
  </div>
);

export default ErrorHandler;

ErrorHandler.propTypes = {
  log: PropTypes.bool.isRequired,
  msg: PropTypes.string.isRequired,
  defErrMsg: PropTypes.string
};

ErrorHandler.defaultPropTypes = {
  defErrMsg: 'An Unexpected Error Occurred.'
};
