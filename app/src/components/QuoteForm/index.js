import React from 'react';
import _ from 'lodash';
import gnum from '../../helpers/global-enum';
// import PartNumberBlock from '../PartNumberBlock';
import MachineNumberBlock from '../MachineNumberBlock';
// import Input from '../Input';

class QuoteForm extends React.Component {
  constructor(props) {
    super(props);
    this.form = {};
    this.getInitialForm = this.getInitialForm.bind(this);
    this.updateForm = this.updateForm.bind(this);
    this.addMachNumBlock = this.addMachNumBlock.bind(this);
    this.addPartNumBlock = this.addPartNumBlock.bind(this);
    this.submit = this.submit.bind(this);
    this.reset = this.reset.bind(this);
    this.state = {
      // form object structure should look like this:
      // {
      //   <machineNumberBlockIndex>: {
      //     <currentChoice>: {
      //       <partNumberBlockIndex>: {
      //         <currentChoice>: <quantity>
      //       }
      //     }
      //   }
      // }
      // where there can be any number of machineNumber or partNumber blocks
      form: this.getInitialForm(),
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

  getInitialForm() {
    return this.props.form 
      ? _.cloneDeep(this.props.form)
      : _.cloneDeep(gnum.INITIAL_QUOTE_FORM)
  }

  updateForm(i, newObj) {
    const form = this.state.form;
    form[i] = newObj;
    this.setState({
      ...this.state,
      form
    });
  }

  addMachNumBlock(e) {
    // prevent the button default so it doesn't submit the form on us
    e.preventDefault();
    const formKeys = Object.keys(this.state.form);
    const newMachNumBlock = {};
    // newMachNumBlock[parseInt(formKeys[formKeys.length - 1], 10) + 1] = _.clone(gnum.INITIAL_MACH_NUM_BLOCK);
    newMachNumBlock[parseInt(formKeys[formKeys.length - 1], 10) + 1] = _.cloneDeep(gnum.INITIAL_MACH_NUM_BLOCK);
    const newState = {
      ...this.state,
      form: Object.assign(
        this.state.form,
        newMachNumBlock
      )
    };
    this.setState(newState);
  }

  addPartNumBlock(e, machNumIndex) {
    // prevent the button default so it doesn't submit the form on us
    e.preventDefault();
    const currentChoice = Object.keys(this.state.form[machNumIndex])[0];
    const machNumForm = this.state.form[machNumIndex][currentChoice];
    const machNumFormKeys = Object.keys(machNumForm);
    const newPartNumBlock = {};
    newPartNumBlock[parseInt(machNumFormKeys[machNumFormKeys.length - 1], 10) + 1] = _.cloneDeep(gnum.INITIAL_PART_NUM_BLOCK);
    let newMachNumBlock = {};
    let newMachNumBlockObj = {};
    newMachNumBlockObj[currentChoice] = Object.assign(
      machNumForm,
      newPartNumBlock
    );
    newMachNumBlock[machNumIndex] = newMachNumBlockObj;
    const newState = {
      ...this.state,
      form: Object.assign(
        this.state.form,
        newMachNumBlock
      )
    };
    this.setState(newState);
  }

  submit(e) {
    e.preventDefault();
    
    /* --- TODO: API POST --- */

    console.log(`QuoteForm component => submit function called with ` +
      `form = ${JSON.stringify(this.state.form, null, 2)}`);
    this.reset(e);
  }

  reset(e) {
    e.preventDefault();
    this.setState({
      form: this.getInitialForm(),
      timestamp: Date.now()
    });
  }

  render() {
    const {
      form,
      timestamp
    } = this.state;
    return (
      <div className="QuoteForm" key={timestamp}>
        <h1>Quote Form</h1>
        <form onSubmit={this.submit}>
          {
            Object.keys(form).map((key) => {
              const formObj = form[key];
              return (
                <MachineNumberBlock
                  key={key}
                  index={key}
                  form={formObj}
                  addPartNumBlock={this.addPartNumBlock}
                  updateForm={this.updateForm}
                  submit={this.submit}
                />
              )
            })
          }
          <button
            className="add-machine-number-btn"
            onClick={this.addMachNumBlock}>
            Add Another Machine Number
          </button>
          <button type="submit">Submit</button>
        </form>
        <button onClick={this.reset}>Reset Form</button>
      </div>
    )
  }
}

export default QuoteForm;