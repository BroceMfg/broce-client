import React from 'react';
import OrderAction from './OrderAction';
import AddPriceForm from './AddPriceForm';

class OrderPart extends React.Component {
  constructor(props) {
    super(props);
    this.getOrderAction = this.getOrderAction.bind(this);
    this.toggleAddPriceForm = this.toggleAddPriceForm.bind(this);
    this.state = {
      orderDetail: this.props.orderDetail,
      showAddPriceForm: false
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
        obj.buttonTitle = this.state.showAddPriceForm ? 'Cancel' : 'Add Price';
        obj.func = this.toggleAddPriceForm;
      } else if (this.props.statusType === 'quote' && this.props.orderDetail.price !== null) {
        obj.buttonTitle = this.state.showAddPriceForm ? 'Cancel' : 'Change Price';
        obj.func = this.toggleAddPriceForm;
      } else if (this.props.statusType === 'priced') {
        obj.alertTitle = 'pending client approval';
      }
    } else {
      if (this.props.statusType === 'priced') {
        obj.buttonTitle = 'Accept Price';
      }
    }
    return obj;
  }

  toggleAddPriceForm() {
    this.setState({
      ...this.state,
      showAddPriceForm: !this.state.showAddPriceForm
    });
  }

  render() {
    const {
      orderDetail,
      showAddPriceForm
    } = this.state;
    const orderAction = this.getOrderAction();
    return (
      <div className="OrderPart">
        <div>
          <div>machine_serial_num: {orderDetail.machine_serial_num}</div>
          <div>part_num: {orderDetail.Part.number}</div>
          <div>quantity: {orderDetail.quantity}</div>
          {
            orderDetail.price
              ? <div>price: {orderDetail.price}</div>
              : null
          }
        </div>
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
                orderDetail={orderDetail}
              />
            : null
        }
      </div>
    )
  }
}

export default OrderPart;
