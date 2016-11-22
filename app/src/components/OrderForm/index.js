import React from 'react';
import _ from 'lodash';
import gnum from'../../helpers/global-enum';
import MachineNumber from '../MachineNumber';
// import Input from '../Input';

class OrderForm extends React.Component {
  constructor(props) {
    super(props);

    this.updateForm = this.updateForm.bind(this);
    this.addMachineNum = this.addMachineNum.bind(this);
    // this.updateItem = this.updateItem.bind(this);
    this.clear = this.clear.bind(this);
    this.submit = this.submit.bind(this);
    // using a timestamp key on the ItemForm Component means
    // we can force re-render the component simply by updating the key
    this.state = {
      machineNumbers: {
        'KF-453': [
          'K12334',
          'L7723',
          'W2212'
        ],
        'FR-332': [
          'S2112',
          'F4432',
          'P9934'
        ],
        'LM-499': [
          'K3312',
          'T5541',
          'E3321'
        ],
        'MJ-120': [
          'D4098',
          'S8871',
          'N4409'
        ]
      },
      machineNumberBlocks: [_.clone(gnum.MACH_NUM_BLOCK_OBJ)],
      form: {},
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

  updateForm(index, newValue) {
    // console.log('orderForm update Form newValue');
    // console.log(newValue);

    const cb = () => {
      console.log(`OrderForm updateForm with new state.form = 
        ${JSON.stringify(this.state.form,null, 2)}`);
      const newMachNumBlocks = Object.keys(this.state.form).map((key) => {
        let newObj = _.clone(gnum.MACH_NUM_BLOCK_OBJ);
        newObj.machNumChoice = Object.keys(this.state.form[key])[0] || newObj.machNumChoice;
        return newObj;
      });
      this.setState({
        ...this.state,
        machineNumberBlocks: newMachNumBlocks
      });
    }

    let newObj = {};
    newObj[index] = newValue;
    this.setState({
      ...this.state,
      form: Object.assign(
        this.state.form,
        {},
        newObj
      )
    }, cb);

    console.log('this.state.form');
    console.log(this.state.form);

  }

  addMachineNum() {
    console.log('addMachineNum function called');
    const newMachNumBlocks = this.state.machineNumberBlocks.concat(_.clone(gnum.MACH_NUM_BLOCK_OBJ));
    this.setState({
      ...this.state,
      machineNumberBlocks: newMachNumBlocks
    });
  }

  clear() {
    console.log('clear function called');
    this.setState({
      ...this.state,
      machineNumberBlocks: [_.clone(gnum.MACH_NUM_BLOCK_OBJ)],
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
            machineNumberBlocks.map((machNumBlock, i) => (
              <MachineNumber
                key={i}
                index={i}
                id={gnum.MACH_NUM_ID_PREFIX + i}
                value={machNumBlock.machNumChoice}
                machineNumbers={machineNumbers}
                updateForm={this.updateForm}
                />
            ))
          }
          <a onClick={this.addMachineNum}>Add Machine Number</a>
          <button className="submit" type="submit">Submit</button>
        </form>
        <button className="cancel" onClick={this.clear}>Cancel</button>
      </div>
    )
  }

}

export default OrderForm;