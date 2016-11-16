import React from 'react';
import _ from 'lodash';
import gnum from'../../helpers/global-enum';
import Input from '../Input';

class PartNumber extends React.Component {
  constructor(props) {
    super(props);

    this.quantity = 0;
    this.handleChange = this.handleChange.bind(this);
    this.state = {};
  }

  handleChange(e) {
    const partNumber = e.target.options[e.target.selectedIndex].value;
    console.log(`handleChange function called with value: ${partNumber}`);
    if (partNumber !== 'default') {
      console.log(`current quantity = ${this.props.partNumbers[partNumber]}`);
      const q = document.getElementById(`${this.props.id}-quantity`);
      const quantity = q.value;
      console.log(quantity);
      this.props.updateForm({ partNumber, quantity })
    }
  }

  render() {
    const partNumbers = this.props.partNumbers;
    return (
      <div className="PartNumber" style={{border: 'solid 1px red'}}>
        <select
          id={this.props.id}
          selected={this.props.value}
          onChange={this.handleChange}>
          <option value="default">--part number--</option>
          {
            partNumbers.map(partNum => (
              <option key={partNum} value={partNum}>{partNum}</option>
            ))
          }
        </select>
        <Input
          id={`${this.props.id}-quantity`}
          refProp={(input) => { this.quantity = input }}
          type="number"
          name="quantity"
          placeholder="Quantity"
          required={true}
          value={1} />
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
    console.log(`handleChange function called with value: ${choiceValue}`);
    if (choiceValue !== 'default') {
      console.log(this.props.machineNumbers[choiceValue]);
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
    console.log(`this.props.value = ${this.props.value}`);
    console.log(this.props.machineNumbers);
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