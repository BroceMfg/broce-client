import React from 'react';
import OrderAction from './OrderAction';
import AddPriceForm from './AddPriceForm';

class OrderPart extends React.Component {
  constructor(props) {
    super(props);
    this.getOrderAction = this.getOrderAction.bind(this);
    this.toggleAddPriceForm = this.toggleAddPriceForm.bind(this);
    this.toggleMessage = this.toggleMessage.bind(this);
    this.state = {
      showAddPriceForm: false,
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
        obj.buttonTitle = this.state.showAddPriceForm ? 'Cancel' : 'Add Price';
        obj.func = this.toggleAddPriceForm;
      } else if (this.props.statusType === 'quote' && this.props.orderDetail.price !== null) {
        obj.buttonTitle = this.state.showAddPriceForm ? 'Cancel' : 'Change Price';
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

  toggleAddPriceForm() {
    this.setState({
      ...this.state,
      showAddPriceForm: !this.state.showAddPriceForm
    });
  }

  toggleMessage(message) {
    this.setState({
      ...this.state,
      showMessage: !this.state.showMessage,
      message
    });
  }

  render() {
    const showAddPriceForm = this.state.showAddPriceForm;
    const orderDetail = this.props.orderDetail;
    const orderAction = this.getOrderAction();
    console.log('inside OrderPart component');
    console.log(orderDetail);
    console.log('----------------');
    return (
      <div className="OrderPart">
        {
          this.state.showMessage && this.state.message
            ? 
              <div className="OrderPart-message">
                <span>{this.state.message}</span>
              </div>
            : null
        }
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
                index={this.props.index}
                orderDetail={orderDetail}
                updateOrderDetail={this.props.updateOrderDetail}
                toggleMessage={this.toggleMessage}
              />
            : null
        }
      </div>
    )
  }
}

export default OrderPart;
