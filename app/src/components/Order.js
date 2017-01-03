import React from 'react';
import OrderPart from './OrderPart';

class Order extends React.Component {
  render() {
    const order = this.props.order;
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
              apiUrl={this.props.apiUrl}
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
