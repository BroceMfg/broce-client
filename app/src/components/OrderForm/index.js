import React from 'react';
import _ from 'lodash';
import gnum from'../../helpers/global-enum';
import MachineNumber from '../MachineNumber';

class OrderForm extends React.Component {
  constructor(props) {
    super(props);

    this.updateForm = this.updateForm.bind(this);
    this.addMachineNum = this.addMachineNum.bind(this);
    this.clear = this.clear.bind(this);
    this.submit = this.submit.bind(this);
    // using a timestamp key on the OrderForm Component means
    // we can force re-render the component simply by updating the key
    this.state = {
      // we will retrieve this data from the server before rendering
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
      machineNumberBlocks: [gnum.MACH_NUM_BLOCK_OBJ],
      form: {},
      timestamp: Date.now()
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    // re-render the ItemForm component with new form data
    // check if timestamp hasn't been updated in the past
    // .01 seconds so that infinite loop doesn't occur
    if (Date.now() - this.state.timestamp > 10) {
      this.setState({
        ...this.state,
        timestamp: Date.now()
      });
      return true;
    }
    return false;
  }

  updateForm(index, newValue) {
    let newObj = {};
    newObj[index] = newValue;
    const form = Object.assign(
      this.state.form,
      {},
      newObj
    );
    this.setState({
      ...this.state,
      form
    });

    console.log(`OrderForm updateForm with new state.form = 
      ${JSON.stringify(this.state.form,null, 2)}`);

    const newMachNumBlocks = Object.keys(form).map((key) => {
      let newObj = gnum.MACH_NUM_BLOCK_OBJ;
      // see if the existing mach num block has a choice already made
      const machNumChoice = Object.keys(form[key])[0];
      newObj.machNumChoice = machNumChoice || newObj.machNumChoice;
      return newObj;
    });
    this.setState({
      ...this.state,
      machineNumberBlocks: newMachNumBlocks
    });
  }

  addMachineNum() {
    const newMachNumBlocks = this.state.machineNumberBlocks.concat(gnum.MACH_NUM_BLOCK_OBJ);
    this.setState({
      ...this.state,
      machineNumberBlocks: newMachNumBlocks
    });
  }

  clear() {
    this.setState({
      ...this.state,
      machineNumberBlocks: [gnum.MACH_NUM_BLOCK_OBJ],
      timestamp: Date.now()
    });
  }

  submit(e) {
    e.preventDefault();
    console.log('submit function called')
    console.log(this.state.form);
    this.clear();
  }

  render() {
    const machineNumbers = this.state.machineNumbers;
    const machineNumberBlocks = this.state.machineNumberBlocks;
    console.log(machineNumberBlocks[machineNumberBlocks.length-1]
      .machNumChoice);
    return (
      <div key={this.state.timestamp} className="OrderForm">
        <form
          onSubmit={this.submit}>
          {
            machineNumberBlocks.map((machNumBlock, i) => (
              <MachineNumber
                key={i}
                index={i}
                id={gnum.MACH_NUM_ID_PREFIX + i}
                value={machNumBlock.machNumChoice}
                machineNumbers={machineNumbers}
                updateForm={this.updateForm} />
            ))
          }
          <div>
            {
              machineNumberBlocks[machineNumberBlocks.length-1]
                .machNumChoice !== 'default'
                ? <a
                    className="btn" 
                    onClick={this.addMachineNum}>
                    Add Machine Number
                  </a>
                : null
            }
          </div>
          <button className="submit" type="submit">Submit</button>
        </form>
        <button className="cancel" onClick={this.clear}>Reset Form</button>
      </div>
    )
  }
}

export default OrderForm;