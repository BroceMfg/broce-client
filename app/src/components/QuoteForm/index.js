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
    this.updateForm = this.updateForm.bind(this);
    this.addMachNumBlock = this.addMachNumBlock.bind(this);
    this.addPartNumBlock = this.addPartNumBlock.bind(this);
    this.submit = this.submit.bind(this);
    this.reset = this.reset.bind(this);

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
    
    this.state = {
      form: this.props.form ? _.cloneDeep(this.props.form) : _.cloneDeep(gnum.INITIAL_QUOTE_FORM)
    }
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
    console.log(`newMachNumBlock = ${JSON.stringify(newMachNumBlock, null, 2)}`);
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
    console.log('QuoteForm => addPartNumBlock function called');
    e.preventDefault();
    const currentChoice = Object.keys(this.state.form[machNumIndex])[0];
    const machNumForm = this.state.form[machNumIndex][currentChoice];
    // console.log(`machNumForm = ${JSON.stringify(machNumForm, null, 2)}`);
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
    console.log(`newMachNumBlock = ${JSON.stringify(newMachNumBlock, null, 2)}`);
    // console.log(`newPartNumBlock = ${JSON.stringify(newPartNumBlock, null, 2)}`);
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
    console.log(this.form);
    e.preventDefault();
    console.log('QuoteForm submit called');
    let form = {};
    Object.keys(this.form).forEach((key) => {
      form[key] = this.form[key].value;
    });
    console.log(JSON.stringify(form, null, 2));
  }

  reset() {
    console.log(gnum.INITIAL_QUOTE_FORM);
    console.log('QuoteForm => reset function called');
    const newState = {
      ...this.state,
      form: _.cloneDeep(gnum.INITIAL_QUOTE_FORM)
    };
    this.setState(newState);
  }

  render() {
    const form = this.state.form;
    return (
      <div className="QuoteForm">
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
                />
              )
            })
          }
          <button onClick={this.addMachNumBlock}>Add Another Machine Number</button>
          <button type="submit">Submit</button>
        </form>
        <button onClick={this.reset}>Reset Form</button>
      </div>
    )
  }
}

export default QuoteForm;