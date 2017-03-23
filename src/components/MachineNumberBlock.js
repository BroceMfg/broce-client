import React from 'react';
import _ from 'lodash';
import Input from './Input';
import PartNumberBlock from './PartNumberBlock';

class MachineNumberBlock extends React.Component {
  constructor(props) {
    super(props);
    this.addPartNumBlock = this.addPartNumBlock.bind(this);
    this.onChange = this.onChange.bind(this);
    this.partNumberChanged = this.partNumberChanged.bind(this);
    this.setForm = this.setForm.bind(this);

    this.state = {
      // form should be structured like:
      //  <currentChoice>: {
      //    <partNumberBlockIndex>: {
      //      <currentChoice>: <quantity>
      //    }
      //  }
      // where there can be any number of partNumber blocks
      form: _.cloneDeep(this.props.form)
    }
  }

  addPartNumBlock(e) {
    e.preventDefault();
    this.props.addPartNumBlock(e, this.props.index);
  }

  setForm(form) {
    this.setState({
      ...this.state,
      form
    });
    this.props.updateForm(this.props.index, form);
  }

  onChange() {
    const form = this.state.form;
    console.log(form);
    let formObj = {};
    formObj[this.choice.value] = form[Object.keys(form)[0]];
    this.setForm(formObj);
  }

  partNumberChanged(i, partNumObj) {
    const form = this.state.form;
    form[Object.keys(form)[0]][i] = partNumObj;
    this.setForm(form);
  }

  render() {
    const form = this.state.form;
    const partNums = Object.keys(form[Object.keys(form)[0]]);
    console.log('###');
    console.log(form[Object.keys(form)[0]][0]);
    console.log('###');
    return (
      <div className="MachineNumberBlock">
        <div className="machine-wrapper">
          <div className="span-wrapper"><span>Machine Serial #</span></div>
          <Input 
            refProp={(input) => { this.choice = input }}
            type="number"
            name={`machine_number_${this.props.index}`}
            value={Object.keys(form)[0]}
            placeholder="Machine Serial #"
            parentOnChange={this.onChange}
            submit={this.props.submit}
          />
        </div>
        {
          Object.keys(form)[0] !== ''
            ? partNums.map((key, i) => (
                <PartNumberBlock
                  key={key}
                  index={key}
                  form={form[Object.keys(form)[0]][key]}
                  parentOnChange={this.partNumberChanged}
                  addPartNumBlock={this.addPartNumBlock}
                  submit={this.props.submit}
                  lastOne={(partNums.length - 1) === i}
                  noAddButtons={this.props.noAddButtons}
                />
              ))
            : null
        }
        <div className="add-another-part-wraper">
          {
            (Object.keys(form)[0] !== ''
              && Object.keys(form[Object.keys(form)[0]][partNums.length - 1])[0] !== ''
              && this.props.lastOne
              && !this.props.noAddButtons)
              ?
                <button
                  className="add-machine-number-btn"
                  title="add another machine number"
                  onClick={this.props.addMachNumBlock}
                >+</button>
              : null
          }
        </div>
      </div>
    )
  }
}

export default MachineNumberBlock;