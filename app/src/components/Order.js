import React from 'react';
import OrderAction from './OrderAction';
import AddPriceForm from './AddPriceForm';

class Order extends React.Component {
  constructor(props) {
    super(props);
    this.getOrderAction = this.getOrderAction.bind(this);
    this.toggleAddPriceForm = this.toggleAddPriceForm.bind(this);
    this.state = {
      order: this.props.order,
      parts: this.props.order.Order_Details.map((orderDetail) => orderDetail.Part),
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
      if (this.props.statusType === 'quote') {
        obj.buttonTitle = this.state.showAddPriceForm ? 'Cancel' : 'Add Price';
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
      order,
      parts,
      showAddPriceForm
    } = this.state;
    const orderAction = this.getOrderAction();
    return (
      <div className="Order">
        <div>id: {order.id}</div>
        <div>UserId: {order.UserId}</div>
        <div>StatusTypeId: {order.Order_Statuses[0].StatusTypeId}</div>
        {
          parts.map((part) => (
            <div key={Math.random()}>{JSON.stringify(part)}</div>
          ))
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
            ? <AddPriceForm parts={parts}/>
            : null
        }
      </div>
    )
  }
}

export default Order;
