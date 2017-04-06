import React, { PropTypes } from 'react';
import '../../../css/components/ErrorHandler.css';

const ErrorHandler = props => (
  <div className="ErrorHandler">
    <div className="inner">
      <div className="oops-header-wrapper">
        <h1 className="oops-header">Oops... It appears an error occurred.</h1>
      </div>
      <div className="err-msg-wrapper">
        {
          props.log && props.msg
            ? <span>{props.msg}</span>
            : <span>{props.defErrMsg}</span>
        }
      </div>
      <div className="return-home">
        <button
          onClick={() => {
            localStorage.removeItem('state');
            window.location = '/';
          }}
        >
          Return Home
        </button>
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

ErrorHandler.defaultProps = {
  defErrMsg: 'An Unexpected Error Occurred.'
};
