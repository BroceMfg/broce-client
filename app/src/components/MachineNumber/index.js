import React from 'react';
import _ from 'lodash';
import gnum from'../../helpers/global-enum';
import PartNumber from '../PartNumber';

class MachineNumber extends React.Component {
  constructor(props) {
    super(props);

    this.updateForm = this.updateForm.bind(this);
    this.addPartNum = this.addPartNum.bind(this);
    this.handleChange = this.handleChange.bind(this);    
    this.renderPartNumbers = this.renderPartNumbers.bind(this);
    this.state = {
      partNumberBlocks: [gnum.PART_NUM_BLOCK_OBJ],
    };
  }

  updateForm(index, newValue) {
    let form = this.state.form || {};
    if (this.state.choiceValue) {
      // check if there is alredy an obj corresponding to the choiceValue
      form[this.state.choiceValue] = form[this.state.choiceValue] || {};
      // set the part number's corresponding index to the new partNumber data
      form[this.state.choiceValue][index] = newValue;
      this.setState({
        ...this.state,
        form
      });
    }
    this.props.updateForm(this.props.index, form);
  }

  addPartNum() {
    const newPartNumBlocks = this.state.partNumberBlocks.concat(gnum.PART_NUM_BLOCK_OBJ);
    this.setState({
      ...this.state,
      partNumberBlocks: newPartNumBlocks
    });
  }

  handleChange(e) {
    let choiceValue = e.target.options[e.target.selectedIndex].value;
    choiceValue = choiceValue !== 'default' ? choiceValue : undefined;
    // clear state form, reset partNumberBlocks, and set the new choiceValue
    this.setState({
      ...this.state,
      choiceValue,
      form: undefined,
      partNumberBlocks: [gnum.PART_NUM_BLOCK_OBJ]
    });
    let temp = {};
    temp[choiceValue] = {};
    this.props.updateForm(this.props.index, temp);
  }

  renderPartNumbers(choiceValue) {
    const partNumberBlocks = this.state.partNumberBlocks;
    return (
      <div className="PartNumbers-wrapper">
        {
          partNumberBlocks.map((partNum, i) => (
            <PartNumber
              key={i}
              index={partNumberBlocks.length-1}
              id={gnum.PART_NUM_ID_PREFIX + (partNumberBlocks.length-1)}
              value={partNumberBlocks[i].partNumChoice}
              partNumbers={this.props.machineNumbers[choiceValue]}
              updateForm={this.updateForm}
              parentValue={this.state.choiceValue} />
          ))
        }
        <a
          className="btn"
          onClick={this.addPartNum}>
          Add Part Number
        </a>
      </div>
    )
  }

  render() {
    const machineNumbers = this.props.machineNumbers;
    return (
      <div className="MachineNumber">
        <select
          id={this.props.id}
          selected={this.props.value}
          onChange={this.handleChange}>
          <option value="default">--machine number--</option>
          {
            Object.keys(machineNumbers).map(machNum => (
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