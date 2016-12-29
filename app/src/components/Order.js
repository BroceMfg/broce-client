import React from 'react';
import OrderPart from './OrderPart';

class Order extends React.Component {
  render() {
    const order = this.props.order;
    console.log('hello');
    return (
      <div className="Order">
        <div>id: {order.id}</div>
        <div>UserId: {order.UserId}</div>
        <div>StatusTypeId: {order.Order_Statuses[0].StatusTypeId}</div>
        {
          order.Order_Details.map((orderDetail) => (
            <OrderPart 
              key={orderDetail.id}
              admin={this.props.admin}
              statusType={this.props.statusType}
              orderDetail={orderDetail}
            />
          ))
        }
      </div>
    )
  }
}

export default Order;
