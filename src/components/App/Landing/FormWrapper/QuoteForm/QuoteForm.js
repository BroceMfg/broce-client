import React, { PropTypes } from 'react';
import _ from 'lodash';
import gnum from '../../../../../helpers/global-enum';
import getInitialForm from './middleware/get-initial-form';
import req from '../../../../middleware/request';
import sub from '../../../../middleware/submit';

import MachineNumberBlock from '../../../../MachineNumberBlock';

import '../../../../../css/components/QuoteForm.css';

class QuoteForm extends React.Component {
  constructor(props) {
    super(props);
    this.updateForm = this.updateForm.bind(this);
    this.addMachNumBlock = this.addMachNumBlock.bind(this);
    this.addPartNumBlock = this.addPartNumBlock.bind(this);
    this.submit = this.submit.bind(this);
    this.reset = this.reset.bind(this);
    this.request = req.bind(this);
    this.sub = sub.bind(this);
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
      form: getInitialForm.apply(this),
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
    this.setState({
      ...this.state,
      form: getInitialForm.apply(this)
    });

    // console.log(`QuoteForm component => submit function called with ` +
    //   `form = ${JSON.stringify(form, null, 2)}`);

    let orderDetails = '';
    Object.keys(form).forEach((machKey) => {
      const machNum = Object.keys(form[machKey])[0];
      Object.keys(form[machKey][machNum]).forEach((partKey) => {
        const partNum = Object.keys(form[machKey][machNum][partKey])[0];
        const partQty = form[machKey][machNum][partKey][partNum];
        orderDetails += 'machineSerialNum=' +
          `${machNum === '00000000' ? null : machNum},` +
          `partNum=${partNum},` +
          `partQty=${partQty}|`;
        // orderDetails = orderDetails.concat({
        //   machineSerialNum: machNum === '00000000' ? null : machNum,
        //   partNum,
        //   partQty
        // });
      });
    });

    const dummyData = {
      shipping_address: '1 main street',
      shipping_city: 'Manhattan',
      shipping_state: 'NY',
      shipping_zip: 10001,
      po_number: '678',
      status: 'quote'
    };

    const data = Object.assign(dummyData, {
      // trim the last '|' off the end of orderDetails
      orderDetails: orderDetails.substring(0, orderDetails.length - 1)
    });

    // let formData = `orderDetails=${orderDetails}&`;
    // Object.keys(dummyForm).forEach(key => {
    //   formData += `${key}=${dummyForm[key]}&`;
    // });

    console.log('data');
    console.log(data);

    this.request(
      'POST',
      `${this.props.apiUrl}/orders`,
      data,
      (response) => {
        const resp = JSON.parse(response);
        if (resp && resp.success) {
          console.log('got here');
          console.log('resp');
          console.log(resp);
          console.log(this.props.toggleMessage)
          this.props.toggleMessage('New Quote Created. Thank you!', 'success');
          // reload the page to show the newly created order
          setTimeout(
            () => { window.location.reload(false); },
            // 1500ms = 1.5s -- what I think is enough time to show the success msg
            // but then reload the page fast enough that the user isn't confused
            // as to why the new order hasn't appeared in their orders list yet
            1500
          );
        }
      },
      (errorResponse) => {
        // console.log(errorResponse)
        this.props.toggleMessage('Error: Please try again.', 'error');
      }
    );

    setTimeout(() => {
      this.reset(e);
    }, 50);
  }

  reset(e) {
    e.preventDefault();
    this.setState({
      form: getInitialForm.apply(this),
      timestamp: Date.now()
    });
  }

  render() {
    const {
      form,
      timestamp
    } = this.state;
    const machNums = Object.keys(form);
    return (
      <div className={this.props.stockOrderForm ? 'StockOrderForm' : 'QuoteForm'} key={timestamp}>
        <div className="content-wrapper">
          <h1 className="header">
            {
              this.props.stockOrderForm
                ? <span>New Stock Order</span>
                : <span>New Quote Request</span>
            }
          </h1>
          <form
            onSubmit={this.props.submit || this.submit}
          >
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
                    noAddButtons={this.props.noAddButtons}
                  />
                )
              })
            }
            {
              this.props.stockOrderForm
              ?
                <div>
                  {
                    Object.keys(form[0][Object.keys(form[0])[0]][0])[0] !== ''
                      ?
                        <div>
                          <button className="submit" type="submit">Submit</button>
                          <button className="reset" onClick={this.reset}>Reset Form</button>
                        </div>
                      : null
                  }
                </div>
              :
                <div>
                  {
                    Object.keys(form[0])[0] !== ''
                      ?
                        <div>
                          <button
                            className={
                              Object.keys(form[0][Object.keys(form[0])[0]][0])[0] !== ''
                                ? 'submit'
                                : 'submit hidden'
                            }
                            type="submit"
                          >
                            Submit
                          </button>
                          <button
                            className={
                              Object.keys(form[0][Object.keys(form[0])[0]][0])[0] !== ''
                                ? 'reset'
                                : 'reset with-submit-hidden'
                            }
                            onClick={this.reset}
                          >
                            Reset Form
                          </button>
                        </div>
                      : null
                  }
                </div>
            }
          </form>
        </div>
      </div>
    )
  }
}

export default QuoteForm;

QuoteForm.propTypes = {
  initialForm: PropTypes.shape({})
};

QuoteForm.defaultProps = {
  initialForm: undefined
};
