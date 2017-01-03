import React from 'react';
import Input from './Input';
import { put } from '../middleware/XMLHTTP';

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
    console.log(this.props.orderDetail);
    console.log(`submitted price: ${this.price.value}`);
    // TODO: regex check the input as it is being input and
    // disable the submit button until the input matches is valid
    if (this.price.value > 0.00) {
      put(
        `${this.props.apiUrl}/orders/details/${this.props.orderDetail.id}`,
        `price=${this.price.value}`,
        (response) => {
          console.log(JSON.parse(response));
        },
        (errorResponse) => console.log(errorResponse)
      );
    } else {
      // handle error
      console.log('error: input not valid');
    }
  }

  render() {
    const {
      orderDetail
    } = this.props;
    return (
      <div className="AddPriceForm">
        <Input 
          refProp={(input) => { this.price = input }}
          type="number"
          name={`order_detail_${orderDetail.id}_price`}
          min={0.01}
          placeholder="Price"
          parentOnChange={this.onChange}
          submit={this.submit}
        />
        <button onClick={this.submit}>Submit</button>
      </div>
    )
  }
}

export default AddPriceForm;
