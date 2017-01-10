import React from 'react';
import OrderPart from './OrderPart';
import ShippingAddressForm from './ShippingAddressForm';
import { post, put } from '../middleware/XMLHTTP';

class Order extends React.Component {
  constructor(props) {
    super(props);
    this.updateOrderDetail = this.updateOrderDetail.bind(this);
    this.renderAdminFinalizeControls = this.renderAdminFinalizeControls.bind(this);
    this.toggleShippingAddressForm = this.toggleShippingAddressForm.bind(this);
    this.renderClientAcceptControls = this.renderClientAcceptControls.bind(this);
    this.finalizeOrder = this.finalizeOrder.bind(this);
    this.acceptOrder = this.acceptOrder.bind(this);
    this.state = {
      showShippingAddressForm: false
    };
  }

  updateOrderDetail(newOrderDetail, index) {
    const order = this.props.order;
    let newOrderDetails = order.Order_Details;
    newOrderDetails[index] = newOrderDetail;
    this.props.updateOrder({
      ...order,
      Order_Details: newOrderDetails
    }, this.props.statusType);
  }

  renderAdminFinalizeControls() {
    const orderDetails = this.props.order.Order_Details;
    const allPriced = orderDetails.filter((od) => od.price).length === orderDetails.length;

    let block = (
      <div className="finalize-controls">
        <span>All items must be priced before proceeding.</span>
      </div>
    )

    if (allPriced) {
      // collect total by adding all OrderDetail prices and
      // round down to 2 decimal places
      const total = Math.round(orderDetails
        .map((od) => od.price).reduce((a, b) => a + b) * 100) / 100;
      block = (
        <div className="finalize-controls">
          <span>Total OrderPrice: {total}</span>
          <button onClick={this.finalizeOrder}>Finalize Order</button>
        </div>
      )
    }
    return block;
  }

  toggleShippingAddressForm() {
    this.setState({
      ...this.state,
      showShippingAddressForm: !this.state.showShippingAddressForm
    });
  }

  renderClientAcceptControls() {
    let block;
    if (this.state.showShippingAddressForm) {
      block = (
        <div className="accept-controls">
          <button onClick={this.toggleShippingAddressForm}>Cancel</button>
          <ShippingAddressForm submit={this.acceptOrder} />
        </div>
      );
    } else {
      block = (
        <div className="accept-controls">
          <button onClick={this.toggleShippingAddressForm}>Accept Order</button>
        </div>
      );
    }
    return block;
  }

  // admin function to promote order to the "priced" OrderStatus
  // only available after pricing each item in an order
  finalizeOrder() {
    put(
      `${this.props.apiUrl}/orders/${this.props.order.id}/status?type=priced`,
      null,
      (response) => {
        if (JSON.parse(response).success) {
          // success
          this.props.promoteOrder(this.props.order, this.props.statusType);
        } else {
          // handle error
          console.log('internal server error');
        }
      },
      (errorResponse) => console.log(errorResponse)
    );

  }

  // client order for accepting a "priced" order
  // this will promote the order's OrderStatus to "ordered"
  acceptOrder(form) {
    let formData = ''
    Object.keys(form).forEach(key => {
      formData += `${key}=${form[key]}&`;
    });

    const orderDetailIds = this.props.order.Order_Details.map((orderDetail) => orderDetail.id);

    post(
      `${this.props.apiUrl}/orders/details/${orderDetailIds.join(',')}/shippingaddress?statusType=${this.props.getNextStatusType(this.props.statusType)}`,
      formData,
      (response) => {
        if (JSON.parse(response).success) {
          // success
          this.props.promoteOrder(this.props.order, this.props.statusType);
        } else {
          // handle error
          console.log('internal server error');
        }
      },
      (errorResponse) => console.log(errorResponse)
    );
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
                  : this.props.statusType === 'priced'
                    ? <span>Pending Client Approval.</span>
                    : null
              :
                this.props.statusType === 'quote'
                  ? <span>Waiting for admin to finalize prices.</span>
                  : this.props.statusType === 'priced'
                    ? this.renderClientAcceptControls()
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
