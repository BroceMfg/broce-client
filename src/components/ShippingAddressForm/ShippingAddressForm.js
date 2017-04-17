import React from 'react';
import Input from '../Input';
import autoBind from 'react-autobind';
import _ from 'lodash';

import ExistingAddressSelect from './ExistingAddressSelect';

class ShippingAddressForm extends React.Component {
  constructor(props) {
    super(props);
    autoBind(this);
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

  onExistingAddressSelectChange(e) {
    console.log('onExistingAddressSelectChange');
    const addressIndex = e.target.value;
    const selectedAddress = this.props.addresses[addressIndex];
    console.log(selectedAddress);
    this.setState({
      ...this.state,
      form: {
        street: selectedAddress.street,
        po_number: selectedAddress.po_number,
        city: selectedAddress.city,
        state: selectedAddress.state,
        zip: selectedAddress.zip
      },
      selectedAddressIndex: addressIndex,
      timestamp: Date.now()
    });
  }

  onChange() {
    // po_number is optional, so if it's not present, set it to null
    this.updateForm({
      street: this.street.value,
      city: this.city.value,
      state: this.state.form.state,
      zip: this.zip.value,
      po_number: this.po_number.value.length > 0 ? this.po_number.value : null
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
    this.props.cancel();
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
      <div className="ShippingAddressForm" key={timestamp}>
        {
          this.props.addresses.length > 0
            ?
              <ExistingAddressSelect
                addresses={this.props.addresses}
                onChange={this.onExistingAddressSelectChange}
                originalValue={this.state.selectedAddressIndex}
              />
            : null
        }
        <div className="form-wrapper">
          {
            this.props.addresses.length > 0
              ? <h4>Or Enter a New Address</h4>
              : <h4>Please Enter a Shipping Address</h4>
          }
          <form onSubmit={this.submit}>
            <div className="street-wrapper">
              <div className="span-wrapper"><span>Address</span></div>
              <Input
                refProp={(input) => { this.street = input }}
                type="text"
                name="shipping_address_street"
                value={form.street}
                placeholder="Address"
                parentOnChange={this.onChange}
                submit={this.submit}
              />
            </div>
            <div className="po_number-wrapper">
              <div className="span-wrapper"><span>(optional) P.O. Number</span></div>
              <Input
                refProp={(input) => { this.po_number = input }}
                type="text"
                name="shipping_address_po_number"
                value={form.po_number}
                placeholder="(optional) P.O. Number"
                parentOnChange={this.onChange}
                submit={this.submit}
                required={false}
              />
            </div>
            <div className="city-wrapper">
              <div className="span-wrapper"><span>City</span></div>
              <Input
                refProp={(input) => { this.city = input }}
                type="text"
                name="shipping_address_city"
                value={form.city}
                placeholder="City"
                parentOnChange={this.onChange}
                submit={this.submit}
              />
            </div>
            <div className="state-wrapper">
              <div className="span-wrapper"><span>State</span></div>
              <div className="select-wrapper">
                <select
                  ref="shipping_state"
                  onChange={(e) => {
                    this.setState({
                      ...this.state,
                      form: {
                        ...this.state.form,
                        state: e.target.value
                      }
                    });
                  }}
                  id="state-select"
                  name="shipping_address_state"
                  value={form.state || "none"}
                >
                  <option value="none">Select A State</option>
                  {
                    this.props.statesList.map(state => (
                      <option
                        key={Math.random()}
                        value={state}
                      >
                        {state}
                      </option>
                    ))
                  }
                </select>
              </div>
              {
                // <Input
                  // refProp={(input) => { this.shipping_state = input }}
                  // type="text"
                  // name="shipping_address_state"
                  // value={form.state}
                  // placeholder="State"
                  // parentOnChange={this.onChange}
                  // submit={this.submit}
                // />
              }
            </div>
            <div className="zip-wrapper">
              <div className="span-wrapper"><span>Zip</span></div>
              <Input
                refProp={(input) => { this.zip = input }}
                type="number"
                min={0}
                max={100000}
                maxCharLength={5}
                name="shipping_address_zip"
                value={form.zip}
                placeholder="Zip"
                parentOnChange={this.onChange}
                submit={this.submit}
              />
            </div>
            <button className="submit" type="submit"><span>Submit</span></button>
          </form>
          <button className="cancel" onClick={this.props.cancel}>X</button>
          <button className="reset" onClick={this.reset}><span>Reset Form</span></button>
        </div>
      </div>
    );
  }
}

export default ShippingAddressForm;
