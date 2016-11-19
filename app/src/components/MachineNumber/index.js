import React from 'react';
import _ from 'lodash';
import gnum from'../../helpers/global-enum';
import Input from '../Input';

class PartNumber extends React.Component {
  constructor(props) {
    super(props);

    this.quantity = 0;
    this.handleChange = this.handleChange.bind(this);
    this.renderSelect = this.renderSelect.bind(this);
    this.renderQuantity = this.renderQuantity.bind(this);
    this.state = {
      choiceValue: _.clone(this.props.value),
      quantity: 1,
      timestamp: Date.now()
    };
  }

  componentWillUpdate(nextProps, nextState) {
    console.log('Part Number componentWillUpdate');
    console.log(nextState.quantity);
    console.log(nextState.choiceValue);
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

  handleChange(e) {
    const partNumber = e.target.options[e.target.selectedIndex].value;
    if (partNumber !== 'default') {
      console.log('hello world!');
      this.setState({
        ...this.state,
        choiceValue: partNumber,
        quantity: 1,
        timestamp: Date.now()
      });
      const q = document.getElementById(`${this.props.id}-quantity`);
      const quantity = q.value;
      this.props.updateForm({ partNumber, quantity })
    }
  }

  renderSelect(props) {
    const partNumbers = this.props.partNumbers;
    return (
      <select
        id={this.props.id}
        value={this.state.choiceValue}
        onChange={this.handleChange}>
        <option value="default">--part number--</option>
        {
          partNumbers.map(partNum => (
            <option key={partNum} value={partNum}>{partNum}</option>
          ))
        }
      </select>
    )
  }

  renderQuantity() {
    return (
      <Input
        id={`${this.props.id}-quantity`}
        refProp={(input) => { this.quantity = input }}
        type="number"
        name="quantity"
        placeholder="Quantity"
        required={true}
        value={this.state.quantity} 
        min={1}/>
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
      form: {}
    };
  }

  componentWillUpdate(nextProps, nextState) {
    console.log('MachineNumber componentWillUpdate called');
  }

  updateForm(newValue) {
    console.log('######');
    console.log('updateForm called from Machine Number component');
    console.log(`newValue = ${JSON.stringify(newValue,null,2)}`);
    console.log('######');
    let formObj = {};
    formObj[this.state.choiceValue] = newValue;
    this.props.updateForm(formObj);
  }

  addPartNum() {
    console.log('addPartNum function called');
  }

  handleChange(e) {
    const choiceValue = e.target.options[e.target.selectedIndex].value;
    if (choiceValue !== 'default') {
      this.setState({
        ...this.state,
        choiceValue
      });
      let newObj = {};
      newObj[choiceValue] = this.state.form;
      this.props.updateForm(newObj);
    } else {
      this.setState({
        ...this.state,
        choiceValue: undefined
      });
    }
  }

  renderPartNumbers(choiceValue) {
    const partNumberBlocks = this.state.partNumberBlocks;
    return (
      <div style={{border: 'solid 3px yellow'}}>
        {
          partNumberBlocks.map((partNum, i) => (
            <PartNumber
              key={partNum}
              id={gnum.PART_NUM_ID_PREFIX + (partNumberBlocks.length-1)}
              value={partNumberBlocks[i].partNumChoice}
              partNumbers={this.props.machineNumbers[choiceValue]}
              updateForm={this.updateForm}
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