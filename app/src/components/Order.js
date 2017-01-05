import React from 'react';
import OrderPart from './OrderPart';

class Order extends React.Component {
  constructor(props) {
    super(props);
    this.updateOrderDetail = this.updateOrderDetail.bind(this);
    this.renderAdminFinalizeControls = this.renderAdminFinalizeControls.bind(this);
    this.finalizeOrder = this.finalizeOrder.bind(this);
    this.acceptOrder = this.acceptOrder.bind(this);
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

  renderAdminFinalizeControls() {
    const orderDetails = this.props.order.Order_Details;
    const allPriced = orderDetails.filter((od) => od.price).length === orderDetails.length;

    let block = (
      <div className="finalize-controls-wrapper">
        <span>All items must be priced before proceeding.</span>
      </div>
    )

    if (allPriced) {
      const total = orderDetails.map((od) => od.price).reduce((a, b) => a + b);
      block = (
        <div className="finalize-controls">
          <span>Total OrderPrice: {total}</span>
          <button onClick={this.finalizeOrder}>Finalize Order</button>
        </div>
      )
    }
    return block;
  }

  // admin function to promote order to the "priced" OrderStatus
  // only available after pricing each item in an order
  finalizeOrder() {
    console.log(`admin finalizing order ${this.props.order.id}`);
  }

  // client order for accepting a "priced" order
  // this will promote the order's OrderStatus to "ordered"
  acceptOrder() {
    console.log(`client accepting order ${this.props.order.id}`);
  }

  render() {
    const order = this.props.order;
    return (
      <div className="Order">
        <div className="status-message">
          {
            this.props.admin
              ?
                this.props.statusType === 'quote'
                  ? this.renderAdminFinalizeControls()
                  : <span>Pending Client Approval.</span>
              :
                this.props.statusType === 'quote'
                  ? <span>Waiting for admin to finalize prices.</span>
                  : this.props.statusType === 'priced'
                    ? <button onClick={this.acceptOrder}>Accept Order</button>
                    : null
          }
        </div>
        <div>id: {order.id}</div>
        <div>UserId: {order.UserId}</div>
        <div>StatusTypeId: {order.Order_Statuses[0].StatusTypeId}</div>
        {
          order.Order_Details.map((orderDetail, i) => {
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
