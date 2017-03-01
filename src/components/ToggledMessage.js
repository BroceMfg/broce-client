import React from 'react';

import '../css/components/ToggledMessage.css';

const ToggledMessaged = (props) => (
  <div className={`ToggledMessage ${props.messageStatusCode || ''}`}>
    <div className="content-wrapper">
      <button onClick={props.dismiss}>
        <span>X</span>
      </button>
      <span>{props.message}</span>
    </div>
  </div>
)

export default ToggledMessaged;