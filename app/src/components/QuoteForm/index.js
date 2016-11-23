import React from 'react';
import _ from 'lodash';
import Input from '../Input';

class MachineNumberBlock extends React.Component {
  render() {
    return (
      <div className="MachineNumberBlock">
        <span>MachineNumberBlock with index = {this.props.index}</span>
      </div>
    )
  }
}

class QuoteForm extends React.Component {
  constructor(props) {
    super(props);
    this.form = {};
    this.addMachNumBlock = this.addMachNumBlock.bind(this);
    this.submit = this.submit.bind(this);

    // form structure should be like:
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
    this.initialMachNumBlock = { 'default': {} };
    const initialForm = { 0: this.initialMachNumBlock };

    this.state = {
      form: this.props.form ? _.clone(this.props.form) : initialForm
    }
  }

  addMachNumBlock(e) {
    // prevent the button default so it doesn't submit the form on us
    e.preventDefault();
    console.log('addMachNumBlock function called');
    const formKeys = Object.keys(this.state.form);
    const newMachNumBlock = {};
    newMachNumBlock[parseInt(formKeys[formKeys.length - 1]) + 1] = this.initialMachNumBlock;
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
    console.log('QuoteForm submit called');
    let form = {};
    Object.keys(this.form).forEach((key) => {
      form[key] = this.form[key].value;
    });
    console.log(JSON.stringify(form, null, 2));
  }

  render() {
    const form = this.state.form;
    return (
      <div className="OrderForm">
        <h1>Quote Form</h1>
        <form onSubmit={this.submit}>
          {/*<Input 
            refProp={(input) => { this.form.name = input }}
            type="text"
            name="name"
            placeholder="Name"
            value={'Andrew'}
          />*/}
          {
            Object.keys(form).map(key => (
              <MachineNumberBlock
                key={key}
                index={key}
              />
            ))
          }
          <button onClick={this.addMachNumBlock}>Add Another Machine Number</button>
          <button type="submit">Submit</button>
        </form>
      </div>
    )
  }
}

export default QuoteForm;