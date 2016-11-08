import React from 'react';

export default (props) => {
  let Protected = (props) => (
    <div className="Protected">
    {
      props.admin
        ? React.Children.only(props.children[0], {...props})
        : React.Children.only(props.children[1], {...props})
    }
    </div>
  )
  return (
    <Protected admin={props.admin}>
      <props.AdminApp />
      <props.App />
    </Protected>
  )
}