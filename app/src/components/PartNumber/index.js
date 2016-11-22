import React from 'react';
import _ from 'lodash';

class PartNumber extends React.Component {
  constructor(props) {
    super(props);

    this.updateForm = this.updateForm.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.renderSelect = this.renderSelect.bind(this);
    this.subtractOne = this.subtractOne.bind(this);
    this.addOne = this.addOne.bind(this);
    this.renderQuantity = this.renderQuantity.bind(this);
    this.state = {
      choiceValue: _.clone(this.props.value),
      quantity: 1,
      timestamp: Date.now()
    };
  }

  componentWillUpdate(nextProps, nextState) {
    // reset choiceValue to default if parentValue changes
    if (this.props.parentValue !== nextProps.parentValue) {
      this.setState({
        ...this.state,
        choiceValue: 'default'
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    // re-render the ItemForm component with new form data
    // check if timestamp hasn't been updated in the past
    // .01 seconds so that infinite loop doesn't occur
    if (Date.now() - this.state.timestamp > 10) {
      return true;
    }
    return false;
  }

  handleSelectChange(e) {
    const partNumber = e.target.options[e.target.selectedIndex].value;
    const quantity = partNumber !== 'default' ? 1 : undefined;
    this.setState({
      ...this.state,
      choiceValue: partNumber,
      quantity,
      timestamp: Date.now()
    }, () => this.updateForm(partNumber, quantity));
  }

  renderSelect(props) {
    const partNumbers = this.props.partNumbers;
    return (
      <select
        id={this.props.id}
        value={this.state.choiceValue}
        onChange={this.handleSelectChange}>
        <option value="default">--part number--</option>
        {
          partNumbers.map(partNum => (
            <option key={partNum} value={partNum}>{partNum}</option>
          ))
        }
      </select>
    )
  }

  updateForm(choiceVal, partQuantity) {
    const choiceValue = choiceVal || this.state.choiceValue;
    const quantity = partQuantity || this.state.quantity
    if (this.state.choiceValue !== 'default') {
      this.props.updateForm(
        this.props.index,
        {
          partNumber: choiceValue,
          quantity
        }
      );
    }
  }

  subtractOne(e) {
    e.preventDefault();
    const currentQuantity = this.state.quantity;
    // to remove a part entirely, we'll use a separate remove button
    if (currentQuantity > 1) {
      this.setState({
        ...this.state,
        quantity: currentQuantity - 1
      }, this.updateForm);
    }
  }

  addOne(e) {
    e.preventDefault();
    this.setState({
      ...this.state,
      quantity: this.state.quantity + 1
    }, this.updateForm);
  }

  renderQuantity() {
    return (
      <div className="quantity">
        <span>{this.state.quantity}</span>
        <button onClick={this.subtractOne}>-</button>
        <button onClick={this.addOne}>+</button>
      </div>
    )
  }

  render() {
    return (
      <div key={this.state.timestamp} className="PartNumber">
        {this.renderSelect()}
        {this.state.choiceValue === 'default' ? null : this.renderQuantity()}
      </div>
    )
  }
}

export default PartNumber;