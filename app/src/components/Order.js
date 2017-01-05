import React from 'react';
import OrderPart from './OrderPart';

class Order extends React.Component {
  constructor(props) {
    super(props);
    this.updateOrderDetail = this.updateOrderDetail.bind(this);
  }

  updateOrderDetail(newOrderDetail, index) {
    const order = this.props.order;
    let newOrderDetails = order.Order_Details;
    newOrderDetails[index] = newOrderDetail;
    this.props.updateOrder({
      ...order,
      Order_Details: newOrderDetails
    });
  }

  componentWillUpdate(nextProps, nextState) {
    // console.log(nextProps.order.Order_Details);
  }

  render() {
    const order = this.props.order;
    return (
      <div className="Order">
        <div>id: {order.id}</div>
        <div>UserId: {order.UserId}</div>
        <div>StatusTypeId: {order.Order_Statuses[0].StatusTypeId}</div>
        {
          order.Order_Details.map((orderDetail, i) => {
            console.log('inside Order map func');
            console.log(orderDetail);
            console.log('-----------------');
            return (<OrderPart
              key={orderDetail.id}
              index={i}
              admin={this.props.admin}
              apiUrl={this.props.apiUrl}
              statusType={this.props.statusType}
              orderDetail={orderDetail}
              updateOrderDetail={this.updateOrderDetail}
            />
          )})
        }
      </div>
    )
  }
}

export default Order;
