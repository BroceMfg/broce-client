import React from 'react';
import _ from 'lodash';
import Input from './Input';

class PartNumberBlock extends React.Component {
  constructor(props) {
    super(props);
    this.setForm = this.setForm.bind(this);
    this.onChange = this.onChange.bind(this);
    this.state = {
      // form should be structured like:
      // {
      //   <currentChoice>: <quantity>
      // }
      // where currentChoice is a string and quantity is a number
      form: _.cloneDeep(this.props.form)
    }
  }

  setForm(form) {
    this.setState({
      ...this.state,
      form
    });
    this.props.parentOnChange(this.props.index, form);
  }

  onChange() {
    let form = {};
    form[this.choice.value] = this.quantity ? this.quantity.value : 1;
    this.setForm(form);
  }

  render() {
    const form = this.state.form;
    return (
      <div className="PartNumberBlock">
        <span>PartNumber</span>
        <Input 
          refProp={(input) => { this.choice = input }}
          type="text"
          name={`part_number_${this.props.index}`}
          value={Object.keys(form)[0]}
          placeholder="Part Number"
          parentOnChange={this.onChange}
        />
        {
          Object.keys(this.state.form)[0] !== ''
            ? <div className="quantity">
                <span>Quantity</span>
                <Input
                  refProp={(input) => { this.quantity = input }}
                  type="number"
                  name={`part_number_${this.props.index}_quantity`}
                  value={form[Object.keys(form)[0]]}
                  placeholder="Quantity"
                  parentOnChange={this.onChange}
                  submit={this.props.submit}
                />
              </div>
            : null
        }
      </div>
    )
  }
}

export default PartNumberBlock;