import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import OrderPart from './OrderPart';
import ShippingDetailForm from './ShippingDetailForm';
import ShippingAddressForm from './ShippingAddressForm';
import { post, put } from '../middleware/XMLHTTP';

import '../css/components/Order.css';

class Order extends React.Component {
  constructor(props) {
    super(props);
    this.updateOrderDetail = this.updateOrderDetail.bind(this);
    this.renderStatusMessage = this.renderStatusMessage.bind(this);
    this.toggleDetails = this.toggleDetails.bind(this);
    this.toggleControls = this.toggleControls.bind(this);
    this.renderControls = this.renderControls.bind(this);
    this.finalizeControls = this.finalizeControls.bind(this);
    this.shippingControls = this.shippingControls.bind(this);
    this.acceptControls = this.acceptControls.bind(this);
    this.finalizeOrder = this.finalizeOrder.bind(this);
    this.acceptOrder = this.acceptOrder.bind(this);
    this.addShippingDetail = this.addShippingDetail.bind(this);
    this.state = {
      showDetails: false,
      showControls: false
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

  renderStatusMessage() {
    const renderBlock = (content, sClass) => (
      <div className={`status-message ${sClass}`}>
        {content}
      </div>
    );
    let sClass;
    let content = null;

    if (this.props.admin) {
      if (this.props.statusType === 'quote') {
        this.finalizeControls();
      } else if (this.props.statusType === 'priced') {
        sClass = 'pending';
        content = (
          <span>Pending Client Approval.</span>
        );
      } else if (this.props.statusType === 'ordered') {
        sClass = 'controls-wrapper';
        content = this.shippingControls();
      }
    } else {
      if (this.props.statusType === 'quote') {
        sClass = 'pending';
        content = (
          <span>Waiting for admin to finalize prices.</span>
        );
      } else if (this.props.statusType === 'priced') {
        sClass = 'controls-wrapper';
        content = this.acceptControls();
      }
    }
        
    return content ? renderBlock(content, sClass) : null;
  }

  toggleDetails(show) {
    let showDetails;
    if (show !== undefined && typeof show === 'boolean') {
      showDetails = show;
    } else {
      showDetails = !this.state.showDetails;
    }
    this.setState({
      ...this.state,
      showDetails
    });
  }

  toggleControls() {
    this.setState({
      ...this.state,
      showControls: !this.state.showControls
    });
  }

  // Provide either a button or a message (message is optional, button is default)
  // if message is used, buttonTitle should be null and message should be a string
  renderControls(precondition, buttonTitle, toggledBlock, message) {
    let content;
    if (precondition) {
      content = (
        <div>
          {
            message
              ? null
              : <button onClick={this.toggleControls}><span>Cancel</span></button>
          }
          {toggledBlock}
        </div>
      );
    } else {
      if (message) {
        content = <span>{message}</span>;
      } else {
        content = <button onClick={this.toggleControls}><span>{buttonTitle}</span></button>;
      }
    }
    return <div className="controls">{content}</div>;
  }

  finalizeControls() {
    const orderDetails = this.props.order.Order_Details;

    const allPriced = orderDetails
      .filter((od) => od.price).length === orderDetails.length;

    const total = Math.round(orderDetails
      .map((od) => (od.price * od.quantity)).reduce((a, b) => a + b) * 100) / 100;

    return this.renderControls(
      allPriced,
      null,
      (
        <div>
          <button onClick={this.finalizeOrder}><span>Finalize Order</span></button>
          <span>Total OrderPrice: {total}</span>
        </div>
      ),
      'All items must be priced before proceeding.'
    );
  }

  shippingControls() {
    return this.renderControls(
      this.state.showControls,
      'Mark Shipped',
      <ShippingDetailForm submit={this.addShippingDetail} />
    );
  }

  acceptControls() {
    return this.renderControls(
      this.state.showControls,
      'Accept Order',
      <ShippingAddressForm submit={this.acceptOrder} />
    );
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

    const orderDetailIds = this.props.order.Order_Details
      .map((orderDetail) => orderDetail.id);

    const statusType = this.props.getNextStatusType(this.props.statusType);

    post(
      `${this.props.apiUrl}/orders/details/${orderDetailIds.join(',')}` + 
        `/shippingaddress?statusType=${statusType}`,
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

  addShippingDetail(form) {
    let formData = ''
    Object.keys(form).forEach(key => {
      formData += `${key}=${form[key]}&`;
    });

    const orderDetailIds = this.props.order.Order_Details
      .map((orderDetail) => orderDetail.id);

    const statusType = this.props.getNextStatusType(this.props.statusType);

    put(
      `${this.props.apiUrl}/orders/details/${orderDetailIds.join(',')}` + 
        `?statusType=${statusType}`,
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
        { 
          this.renderStatusMessage()
        }
        <div>id: {order.id}</div>
        <div>UserId: {order.UserId}</div>
        <div>StatusTypeId: {order.Order_Statuses[0].StatusTypeId}</div>
        <button onClick={this.toggleDetails}>
          {
            this.state.showDetails
              ? <span>Hide Details</span>
              : <span>Show Details</span>
          }
        </button>
        <ReactCSSTransitionGroup
          className={
            `OrderPart-wrapper ${this.state.showDetails ? 'show' : 'hide'}`
          }
          component="div"
          transitionName="OrderPart-wrapper-transition"
          transitionEnterTimeout={350}
          transitionLeaveTimeout={350}
        >
          {
            this.state.showDetails
              ? order.Order_Details.map((orderDetail, i) =>
                  <OrderPart
                    key={orderDetail.id}
                    index={i}
                    admin={this.props.admin}
                    apiUrl={this.props.apiUrl}
                    statusType={this.props.statusType}
                    orderDetail={orderDetail}
                    updateOrderDetail={this.updateOrderDetail}
                    toggleMessage={this.props.toggleMessage}
                  />
                )
              : null
          }
        </ReactCSSTransitionGroup>
      </div>
    )
  }
}

export default Order;
