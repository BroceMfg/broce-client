import React from 'react';
import _ from 'lodash';
import gnum from'../../helpers/global-enum';

class PartNumber extends React.Component {
  constructor(props) {
    super(props);

    this.quantity = 0;
    this.updateForm = this.updateForm.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.renderSelect = this.renderSelect.bind(this);
    this.subtractOne = this.subtractOne.bind(this);
    this.addOne = this.addOne.bind(this);
    this.renderQuantity = this.renderQuantity.bind(this);
    this.state = {
      parentValue: this.props.parentValue,
      choiceValue: _.clone(this.props.value),
      quantity: 1,
      timestamp: Date.now()
    };
  }

  componentWillUpdate(nextProps, nextState) {
    console.log('Part Number componentWillUpdate');
    console.log(nextState.quantity);
    console.log(nextState.choiceValue);
    console.log('nextProps.parentValue');
    if (this.props.parentValue !== nextProps.parentValue) {
      this.setState({
        ...this.state,
        choiceValue: 'default'
      });
    }
    console.log(nextProps.parentValue);
    console.log('this.props.parentValue');
    console.log(this.props.parentValue);

  }

  shouldComponentUpdate(nextProps, nextState) {
    // re-render the ItemForm component with new form data
    // check if timestamp hasn't been updated in the past
    // .01 seconds so that infinite loop doesn't occur
    if (Date.now() - this.state.timestamp > 10) {
      console.log('Part Number Component updating');
      return true;
    }
    return false;
  }

  handleSelectChange(e) {
    const partNumber = e.target.options[e.target.selectedIndex].value;
      this.setState({
        ...this.state,
        choiceValue: partNumber,
        quantity: partNumber !== 'default' ? 1 : undefined,
        timestamp: Date.now()
      }, this.updateForm);
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

  updateForm() {
    if (this.state.choiceValue !== 'default') {
      this.props.updateForm(this.props.index, { partNumber: this.state.choiceValue, quantity: this.state.quantity
      });
    }
  }

  subtractOne(e) {
    e.preventDefault();
    const currentQuantity = this.state.quantity;
    // to remove a part entirely, we'll use a remove button
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
    console.log('this.state.choiceValue');
    console.log(this.state.choiceValue);
    return (
      <div key={this.state.timestamp} className="PartNumber" style={{border: 'solid 1px red'}}>
        {this.renderSelect()}
        {this.state.choiceValue === 'default' ? null : this.renderQuantity()}
      </div>
    )
  }
}

class MachineNumber extends React.Component {
  constructor(props) {
    super(props);

    this.updateForm = this.updateForm.bind(this);
    this.addPartNum = this.addPartNum.bind(this);
    this.handleChange = this.handleChange.bind(this);    
    this.renderPartNumbers = this.renderPartNumbers.bind(this);
    this.state = {
      partNumberBlocks: _.clone(gnum.PART_NUM_BLOCKS_DEFAULT),
      // form: {}
    };
  }

  componentWillUpdate(nextProps, nextState) {
    console.log('MachineNumber componentWillUpdate called');
  }

  updateForm(index, newValue) {
    // console.log('######');
    // console.log('updateForm called from Machine Number component');
    // console.log(`newValue = ${JSON.stringify(newValue,null,2)}`);
    // console.log('######');
    // console.log('@@@@@@@@@@@@');
    // console.log(`formObj = ${JSON.stringify(formObj, null, 2)}`);
    // console.log('@@@@@@@@@@@@');
    // this.props.updateForm(formObj);
    console.log('%%%%%%%%%%');
    console.log(this.state.form);
    console.log('%%%%%%%%%%');
    let form = this.state.form || {};
    if (this.state.choiceValue) {
      form[this.state.choiceValue] = form[this.state.choiceValue] || {};
      console.log('########');
      console.log(form);
      console.log('########');
      form[this.state.choiceValue][index] = newValue;
      console.log('^^^^^^^^^')
      console.log(form);
      console.log('^^^^^^^^^')
      this.setState({
        ...this.state,
        form
      });
    }
    this.props.updateForm(this.props.index, form);
  }

  addPartNum() {
    console.log('addPartNum function called');
  }

  handleChange(e) {
    const cb = () => this.updateForm({});
    const choiceValue = e.target.options[e.target.selectedIndex].value;
    if (choiceValue !== 'default') {
      // clear state form from before
      this.setState({
        ...this.state,
        choiceValue,
        form: undefined
      }, cb);
    } else {
      this.setState({
        ...this.state,
        choiceValue: undefined,
        form: undefined
      }, cb);
    }
  }

  renderPartNumbers(choiceValue) {
    const partNumberBlocks = this.state.partNumberBlocks;
    return (
      <div style={{border: 'solid 3px yellow'}}>
        {
          partNumberBlocks.map((partNum, i) => (
            <PartNumber
              key={i}
              index={partNumberBlocks.length-1}
              id={gnum.PART_NUM_ID_PREFIX + (partNumberBlocks.length-1)}
              value={partNumberBlocks[i].partNumChoice}
              partNumbers={this.props.machineNumbers[choiceValue]}
              updateForm={this.updateForm}
              parentValue={this.state.choiceValue}
              />
          ))
        }
        <a onClick={this.addPartNum}>Add Part Number</a>
      </div>
    )
  }

  render() {
    const machineNumbers = this.props.machineNumbers;
    const machNumKeys = Object.keys(machineNumbers);
    return (
      <div className="MachineNumber" style={{border: 'solid 1px blue'}}>
        <select
          id={this.props.id}
          selected={this.props.value}
          onChange={this.handleChange}>
          <option value="default">--machine number--</option>
          {
            machNumKeys.map(machNum => (
              <option key={machNum} value={machNum}>{machNum}</option>
            ))
          }
        </select>
        {
          this.state.choiceValue
            ? this.renderPartNumbers(this.state.choiceValue)
            : null
        }
      </div>
    )
  }
}

export default MachineNumber;