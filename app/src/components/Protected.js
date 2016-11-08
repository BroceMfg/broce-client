import React from 'react';

export default (props) => (
  <div className="Item">
  {
    props.admin
      ? React.Children.only(props.children[0], {...props})
      : React.Children.only(props.children[1], {...props})
  }
  </div>
)