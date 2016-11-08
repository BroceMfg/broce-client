import React from 'react';

export default (props) => (
  <div className="Dashboard">
    <h1 className="Dashboard-header">
      Welcome To {props.title}
    </h1>
    <a
      className="Dashboard-anchor"
      href={props.redirect}>
      {props.buttonTitle}
    </a>
  </div>
)