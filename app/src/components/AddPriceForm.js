import React from 'react';
import Input from './Input';
import { put } from '../middleware/XMLHTTP';

class AddPriceForm extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.submit = this.submit.bind(this);
    this.reset = this.reset.bind(this);
    this.state = { timestamp: Date.now() }
  }

  shouldComponentUpdate(nextProps, nextState) {
    // re-render the ItemForm component with new form data
    // check if timestamp hasn't been updated in the past
    // .01 seconds so that infinite loop doesn't occur
    if (Date.now() - this.state.timestamp > 10) {
      this.setState({
        ...this.state,
        timestamp: Date.now()
      });
      return true;
    }
    return false;
  }

  onChange() {
    // console.log(`price: ${this.price.value}`);
  }

  submit() {
    const price = this.price.value;
    // console.log(this.props.orderDetail);
    // console.log(`submitted price: ${price}`);
    // TODO: regex check the input as it is being input and
    // disable the submit button until the input matches is valid
    if (price > 0.00) {
      this.props.toggleAddPriceForm();
      put(
        `${this.props.apiUrl}/orders/details/${this.props.orderDetail.id}`,
        `price=${price}`,
        (response) => {
          if (JSON.parse(response).success) {
            // console.log(this.props.orderDetail);
            // console.log(this.props.index);
            this.props.updateOrderDetail({
              ...this.props.orderDetail,
              price: parseFloat(price)
            }, this.props.index);
            this.props.toggleMessage('Price Submission Successful.', 'success');
          } else {
            // handle error
            console.log('error: response contained an error.');
            this.props.toggleMessage('Error: Please try again.', 'error');
          }
        },
        (errorResponse) => console.log(errorResponse)
      );
    } else {
      // handle error
      console.log('error: input not valid');
      this.props.toggleMessage('Error: Invalid Price.', 'error');
    }
    this.reset();
  }

  reset() {
    this.setState({
      timestamp: Date.now()
    });
  }

  render() {
    const {
      orderDetail
    } = this.props;
    return (
      <div className="AddPriceForm" key={this.state.timestamp}>
        <div className="input-button-wrapper">
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
      </div>
    )
  }
}

export default AddPriceForm;
