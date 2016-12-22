import React from 'react';

class OrderDetail extends React.Component {
  constructor(props) {
    super(props);
    
    this.handleAction = this.handleAction.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  handleAction() {
    console.log('OrderDetail handleAction');
  }

  handleCancel() {
    console.log('OrderDetail handleCancel');
  }

  render() {
    const order = this.props.order;
    const actionTitle = this.props.actionTitle;
    return (
      <div className="OrderDetail">
        <span>Order ID = {order.id}</span>
        <br/>
        <button
          className="OrderDetail-action"
          onClick={this.handleAction}>
          {actionTitle}
        </button>
        <button
          className="OrderDetail-cancel"
          onClick={this.handleCancel}>
          Cancel Order
        </button>
      </div>
    )
  }
}

export default OrderDetail;