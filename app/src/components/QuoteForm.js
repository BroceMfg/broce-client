import React from 'react';
import _ from 'lodash';
import gnum from '../helpers/global-enum';
import MachineNumberBlock from './MachineNumberBlock';
import { post } from '../middleware/XMLHTTP';

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
    const form = this.state.form;

    // console.log(`QuoteForm component => submit function called with ` +
    //   `form = ${JSON.stringify(form, null, 2)}`);

    let orderDetails = [];
    Object.keys(form).forEach(machKey => {
      const machNum = Object.keys(form[machKey])[0];
      Object.keys(form[machKey][machNum]).forEach(partKey => {
        const partNum = Object.keys(form[machKey][machNum][partKey])[0];
        const partQty = form[machKey][machNum][partKey][partNum];
        orderDetails = orderDetails.concat({
          machineSerialNum: machNum,
          partNum,
          partQty
        });
      });
    });

    console.log(`QuoteForm component => submit function called with ` +
      `orderDetails = ${JSON.stringify(orderDetails, null, 2)}`);

    const dummyForm = {
      shipping_address: '1 main street',
      shipping_city: 'Manhattan',
      shipping_state: 'NY',
      shipping_zip: 10001,
      po_number: '678',
      status: 'quote'
    }

    let formData = `orderDetails=${JSON.stringify(orderDetails)}&`;
    Object.keys(dummyForm).forEach(key => {
      formData += `${key}=${dummyForm[key]}&`;
    });

    console.log(formData);

    // just testing post and get out
    post(
      `${this.props.apiUrl}/orders`,
      formData,
      (response) => console.log(JSON.parse(response)),
      (errorResponse) => console.log(errorResponse)
    );

    /* --- TODO: API POST --- */

    this.reset(e);
  }

  reset(e) {
    e.preventDefault();
    this.setState({
      form: _.cloneDeep(gnum.INITIAL_QUOTE_FORM),
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