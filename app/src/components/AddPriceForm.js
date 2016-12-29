import React from 'react';
import Input from './Input';

class AddPriceForm extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.submit = this.submit.bind(this);
  }

  onChange() {
    console.log(`price: ${this.price.value}`);
  }

  submit() {
    console.log(`submitted price: ${this.price.value}`);
  }

  render() {
    const {
      orderDetail
    } = this.props;
    return (
      <div className="AddPriceForm" style={{marginLeft: '2em'}}>
        <div>machine_serial_num: {orderDetail.machine_serial_num}</div>
        <div>part_num: {orderDetail.Part.number}</div>
        <div>quantity: {orderDetail.quantity}</div>
        <Input 
          refProp={(input) => { this.price = input }}
          type="number"
          name={`order_detail_${orderDetail.id}_price`}
          min={0}
          placeholder="Price"
          parentOnChange={this.onChange}
          submit={this.submit}
        />
        <button onClick={this.submit}>submit</button>
      </div>
    )
  }
}

export default AddPriceForm;
