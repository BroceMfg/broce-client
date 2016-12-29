import React from 'react';

class AddPriceForm extends React.Component {
  render() {
    const {
      orderDetail
    } = this.props;
    return (
      <div className="AddPriceForm" style={{marginLeft: '2em'}}>
        <div>machine_serial_num: {orderDetail.machine_serial_num}</div>
        <div>part_num: {orderDetail.Part.number}</div>
        <div>quantity: {orderDetail.quantity}</div>
        <div>price: INPUT HERE</div>
        <button>submit</button>
      </div>
    )
  }
}

export default AddPriceForm;
