import React from 'react';
import OrderAction from './OrderAction';
import ShippingDetail from './ShippingDetail';
import AddPriceForm from './AddPriceForm';

import '../css/components/OrderPart.css';

class OrderPart extends React.Component {
  constructor(props) {
    super(props);
    this.getOrderAction = this.getOrderAction.bind(this);
    this.toggleShowShippingDetail = this.toggleShowShippingDetail.bind(this);
    this.toggleAddPriceForm = this.toggleAddPriceForm.bind(this);
    this.state = {
      showAddPriceForm: false,
      showShippingDetail: false,
      showMessage: false,
      message: undefined
    }
  }

  getOrderAction() {
    let obj = {
      buttonTitle: undefined,
      alertTitle: undefined,
      func: undefined
    };

    if (this.props.admin) {
      if (this.props.statusType === 'quote'
        && this.props.orderDetail.price === null) {
        obj.buttonTitle = this.state.showAddPriceForm ? 'Cancel' : '+';
        obj.func = this.toggleAddPriceForm;
      } else if (this.props.statusType === 'quote' && this.props.orderDetail.price !== null) {
        obj.buttonTitle = this.state.showAddPriceForm ? 'Cancel' : 'Edit';
        obj.func = this.toggleAddPriceForm;
      } else if (this.props.statusType === 'priced') {
        // do nothing
      }
    } else {
      // accepting price is now accepting order... happens in the Order component
      // if (this.props.statusType === 'priced') {
      //   obj.buttonTitle = 'Accept Price';
      // }
    }
    return obj;
  }

  toggleShowShippingDetail() {
    this.setState({
      ...this.state,
      showShippingDetail: !this.state.showShippingDetail
    });
  }

  toggleAddPriceForm() {
    this.setState({
      ...this.state,
      showAddPriceForm: !this.state.showAddPriceForm
    });
  }

  render() {
    const showAddPriceForm = this.state.showAddPriceForm;
    const orderDetail = this.props.orderDetail;
    const orderAction = this.getOrderAction();
    const shippingDetail = orderDetail.Shipping_Detail;
    return (
      <div className="OrderPart">
        <div className="content-wrapper">
          <div className="details">
            <div className={`shipped${shippingDetail ? ' done' : ''}`}>
              {
                shippingDetail
                  ?
                    <a
                      onClick={this.toggleShowShippingDetail}
                      title="View shipping details"
                    >
                      <div className="done">--</div>
                    </a>
                  : '--'
              }
            </div>
            <div className="machine_serial_num">{orderDetail.machine_serial_num || '--'}</div>
            <div className="part_num">{orderDetail.Part.number}</div>
            <div className="quantity">{orderDetail.quantity}</div>
            <div className="price-unit">
             {
              orderDetail.price
                  ? <span className="each">{`$${orderDetail.price}`}</span>
                  : <span className="each">--</span>
              }
            </div>
            <div className="price-total">
              {
                orderDetail.price
                  ? `$${(orderDetail.price * orderDetail.quantity).toFixed(2)}`
                  : '--'
              }
              <OrderAction
                admin={this.props.admin}
                statusType={this.props.statusType}
                buttonTitle={orderAction.buttonTitle}
                alertTitle={orderAction.alertTitle}
                action={orderAction.func}
              />
              {
                showAddPriceForm
                  ? <AddPriceForm
                      apiUrl={this.props.apiUrl}
                      index={this.props.index}
                      orderDetail={orderDetail}
                      updateOrderDetail={this.props.updateOrderDetail}
                      toggleMessage={this.props.toggleMessage}
                      toggleAddPriceForm={this.toggleAddPriceForm}
                    />
                  : null
              }
            </div>
          </div>
          {
            shippingDetail && this.state.showShippingDetail
              ?
                <ShippingDetail
                  shippingDetail={shippingDetail}
                  hide={this.toggleShowShippingDetail}
                />
              : null
          }
        </div>
      </div>
    )
  }
}

export default OrderPart;
