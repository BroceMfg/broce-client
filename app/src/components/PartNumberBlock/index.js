import React from 'react';
import _ from 'lodash';
import Input from '../Input';

class PartNumberBlock extends React.Component {
  constructor(props) {
    super(props);
    this.setForm = this.setForm.bind(this);
    this.onChange = this.onChange.bind(this);
    this.state = {
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
    form[this.choice.value] = this.quantity.value;
    this.setForm(form);
  }

  render() {
    const form = this.state.form;
    return (
      <div className="PartNumberBlock">
        <span>PartNumberBlock with index = {this.props.index}</span>
        <Input 
          refProp={(input) => { this.choice = input }}
          type="text"
          name={`part_number_${this.props.index}`}
          value={Object.keys(form)[0]}
          placeholder="Part Number"
          parentOnChange={this.onChange}
        />
        <Input 
          refProp={(input) => { this.quantity = input }}
          type="text"
          name={`part_number_${this.props.index}_quantity`}
          value={form[Object.keys(form)[0]]}
          placeholder="Quantity"
          parentOnChange={this.onChange}
        />
      </div>
    )
  }
}

export default PartNumberBlock;