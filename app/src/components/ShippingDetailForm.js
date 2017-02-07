import React from 'react';
import Input from './Input';
import _ from 'lodash';

class ShippingDetailForm extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.updateForm = this.updateForm.bind(this);
    this.submit = this.submit.bind(this);
    this.reset = this.reset.bind(this);
    this.state = {
      form: _.cloneDeep(this.props.form) || {},
      timestamp: Date.now()
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    // re-render the component with new form data
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
    this.updateForm({
      tracking_number: this.tracking_number.value,
      cost: this.cost.value
    });
  }

  updateForm(form) {
    this.setState({
      ...this.state,
      form
    });
  }

  submit(e) {
    e.preventDefault();
    this.props.submit(this.state.form);
    this.reset();
  }

  reset() {
    this.setState({
      form: {},
      timestamp: Date.now()
    });
  }

  render() {
    const {
      form,
      timestamp
    } = this.state;
    return (
      <div className="ShippingDetailForm" key={timestamp}>
        <div className="form-wrapper">
          <h4>Please add Shipping Details</h4>
          <form onSubmit={this.submit}>
            <div className="tracking_number-wrapper">
              <div className="span-wrapper"><span>Tracking Number</span></div>
              <Input
                refProp={(input) => { this.tracking_number = input }}
                type="text"
                name="shipping_details_tracking_number"
                value={form.tracking_number}
                placeholder="Tracking Number"
                parentOnChange={this.onChange}
                submit={this.submit}
              />
            </div>
            <div className="cost-wrapper">
              <div className="span-wrapper"><span>Cost</span></div>
              <Input
                refProp={(input) => { this.cost = input }}
                type="number"
                min={0.01}
                name="shipping_details_cost"
                value={form.cost}
                placeholder="Cost"
                parentOnChange={this.onChange}
                submit={this.submit}
              />
            </div>
            <button className="submit" type="submit">Submit</button>
          </form>
          <button className="reset" onClick={this.reset}>Reset Form</button>
          <button className="cancel" onClick={this.props.cancel}>X</button>
        </div>
      </div>
    );
  }
}

export default ShippingDetailForm;
