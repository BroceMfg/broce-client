import React from 'react';
import _ from 'lodash';
import gnum from'../../helpers/global-enum';
import MachineNumber from '../MachineNumber';
// import Input from '../Input';

class OrderForm extends React.Component {
  constructor(props) {
    super(props);

    this.addMachineNum = this.addMachineNum.bind(this);
    // this.updateItem = this.updateItem.bind(this);
    this.clear = this.clear.bind(this);
    this.submit = this.submit.bind(this);
    // using a timestamp key on the ItemForm Component means
    // we can force re-render the component simply by updating the key
    this.state = {
      machineNumbers: {
        'KF-453': {
          'K12334': 0,
          'L7723': 0,
          'W2212': 0
        },
        'FR-332': {
          'S2112': 0,
          'F4432': 0,
          'P9934': 0
        },
        'LM-499': {
          'K3312': 0,
          'T5541': 0,
          'E3321': 0
        },
        'MJ-120': {
          'D4098': 0,
          'S8871': 0,
          'N4409': 0
        }
      },
      machineNumberBlocks: _.clone(gnum.MACH_NUM_BLOCKS_DEFAULT),
      timestamp: Date.now()
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    // re-render the ItemForm component with new form data
    // check if timestamp hasn't been updated in the past
    // .01 seconds so that infinite loop doesn't occur
    if (Date.now() - this.state.timestamp > 10) {
      console.log('OrderForm Component updating');
      this.setState({
        ...this.state,
        timestamp: Date.now()
      });
      return true;
    }
    return false;
  }

  addMachineNum() {
    console.log('addMachineNum function called');
  }

  clear() {
    console.log('clear function called');
    this.setState({
      ...this.state,
      machineNumberBlocks: _.clone(gnum.MACH_NUM_BLOCKS_DEFAULT),
      timestamp: Date.now()
    });
  }

  submit(e) {
    e.preventDefault();

    console.log('submit function called')

    this.clear();
  }

  render() {
    const machineNumbers = this.state.machineNumbers;
    const machineNumberBlocks = this.state.machineNumberBlocks;
    return (
      <div key={this.state.timestamp} className="OrderForm">
        <form
          ref={(input) => this.orderForm = input} 
          onSubmit={this.submit}>
          {
            machineNumberBlocks.map((machNum, i) => (
              <MachineNumber
                key={machNum}
                id={gnum.MACH_NUM_ID_PREFIX + (machineNumberBlocks.length-1)}
                value={machineNumberBlocks[i].machNumChoice}
                machineNumbers={machineNumbers}
                />
            ))
          }
          <a onClick={this.addMachineNum}>Add Machine Number</a>
          {/*
          <Input 
            refProp={(input) => { this.orderObj.name = input }}
            type="text"
            name="name"
            placeholder="Name"
            required={false}
            value={form.name} />
          <Input 
            refProp={(input) => { this.orderObj.cost = input }}
            type="text"
            name="cost"
            placeholder="Cost"
            required={false}
            value={form.cost} />
          */}
          <button className="submit" type="submit">Submit</button>
        </form>
        <button className="cancel" onClick={this.clear}>Cancel</button>
      </div>
    )
  }

}

export default OrderForm;