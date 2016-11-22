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
      partNumberBlocks: [_.clone(gnum.PART_NUM_BLOCK_OBJ)],
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
      console.log('********');
      console.log(form[this.state.choiceValue]);
      console.log('********');
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
    const newPartNumBlocks = this.state.partNumberBlocks.concat(_.clone(gnum.PART_NUM_BLOCK_OBJ));
    this.setState({
      ...this.state,
      partNumberBlocks: newPartNumBlocks
    });
  }

  handleChange(e) {
    
    const cb2 = () => {
      let temp = {};
      temp[this.state.choiceValue] = {};
      this.props.updateForm(this.props.index, temp);
    }

    const cb = () => this.setState({
      ...this.state,
      form: undefined
    }, cb2);

    const choiceValue = e.target.options[e.target.selectedIndex].value;
    if (choiceValue !== 'default') {
      // clear state form from before
      this.setState({
        ...this.state,
        choiceValue,
        form: undefined,
        partNumberBlocks: [_.clone(gnum.PART_NUM_BLOCK_OBJ)]
      }, cb);
    } else {
      this.setState({
        ...this.state,
        choiceValue: undefined,
        form: undefined,
        partNumberBlocks: [_.clone(gnum.PART_NUM_BLOCK_OBJ)]
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