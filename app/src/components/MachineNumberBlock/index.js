import React from 'react';
import _ from 'lodash';
import Input from '../Input';
import PartNumberBlock from '../PartNumberBlock';

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
    return (
      <div className="MachineNumberBlock">
        <span>Machine Number</span>
        <Input 
          refProp={(input) => { this.choice = input }}
          type="text"
          name={`machine_number_${this.props.index}`}
          value={Object.keys(form)[0]}
          placeholder="Machine Number"
          parentOnChange={this.onChange}
          submit={this.props.submit}
        />
        {
          Object.keys(form)[0] !== ''
            ? Object.keys(form[Object.keys(form)[0]]).map(key => (
                <PartNumberBlock
                  key={key}
                  index={key}
                  form={form[Object.keys(form)[0]][key]}
                  parentOnChange={this.partNumberChanged}
                  submit={this.props.submit}
                />
              ))
            : null
        }
        <button
          className="add-part-number-btn"
          onClick={this.addPartNumBlock}>
          Add Another Part Number
        </button>
      </div>
    )
  }
}

export default MachineNumberBlock;