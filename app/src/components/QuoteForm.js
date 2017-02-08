import React from 'react';
import _ from 'lodash';
import gnum from '../helpers/global-enum';
import MachineNumberBlock from './MachineNumberBlock';
import { post } from '../middleware/XMLHTTP';

import '../css/components/QuoteForm.css';

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
      (response) => {
        console.log(JSON.parse(response))
        if (response) {
          this.props.toggleMessage('New Quote Created. Thank you!', 'success');
        }
      },
      (errorResponse) => {
        // console.log(errorResponse)
        this.props.toggleMessage('Error: Please try again.', 'error');
      }
    );

    /* --- TODO: API POST --- */

    this.setState({
      ...this.state,
      form: undefined
    });
    setTimeout(() => {
      this.reset(e);
    }, 50);
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
    console.log('$$$$');
    console.log(form);
    console.log('$$$$');
    const machNums = Object.keys(form);
    return (
      <div className="QuoteForm" key={timestamp}>
        <div className="content-wrapper">
          <h1 className="header">
            <span>New Quote Request</span>
          </h1>
          <form onSubmit={this.submit}>
            {
              machNums.map((key, i) => {
                const formObj = form[key];
                return (
                  <MachineNumberBlock
                    key={key}
                    index={key}
                    form={formObj}
                    addPartNumBlock={this.addPartNumBlock}
                    addMachNumBlock={this.addMachNumBlock}
                    updateForm={this.updateForm}
                    submit={this.submit}
                    lastOne={(machNums.length - 1) === i}
                  />
                )
              })
            }
            {
              Object.keys(form[0])[0] !== ''
                ?
                  <div>
                    <button className="submit" type="submit">Submit</button>
                    <button className="reset" onClick={this.reset}>Reset Form</button>
                  </div>
                : null
            }
          </form>
        </div>
      </div>
    )
  }
}

export default QuoteForm;