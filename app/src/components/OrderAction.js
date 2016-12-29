import React from 'react';

class OrderAction extends React.Component {
  render() {
    const {
      buttonTitle,
      alertTitle,
      action
    } = this.props;
    return (
      <div className="status">
        {
          buttonTitle
            ? <button onClick={action}>{buttonTitle}</button>
            : <div>{alertTitle}</div>
        }
      </div>
    )
  }
}

export default OrderAction;
