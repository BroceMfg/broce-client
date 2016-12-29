import React from 'react';
import OrderAction from './OrderAction';

class Order extends React.Component {
  render() {
    const {
      order
    } = this.props;
    console.log(order);
    return (
      <div className="Order">
        <div>id: {order.id}</div>
        <div>UserId: {order.UserId}</div>
        <div>StatusTypeId: {order.Order_Statuses[0].StatusTypeId}</div>
        <OrderAction />
      </div>
    )
  }
}

export default Order;
