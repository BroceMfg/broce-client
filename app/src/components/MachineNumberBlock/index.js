import React from 'react';
import _ from 'lodash';
import Input from '../Input';
import PartNumberBlock from '../PartNumberBlock';

class MachineNumberBlock extends React.Component {
  constructor(props) {
    super(props);
    this.addPartNumBlock = this.addPartNumBlock.bind(this);
    this.onChange = this.onChange.bind(this);
    this.state = {
      form: _.cloneDeep(this.props.form)
    }
  }

  addPartNumBlock(e) {
    e.preventDefault();
    this.props.addPartNumBlock(e, this.props.index);
  }

  onChange() {
    console.log(`choice = ${this.choice.value}`);
    const form = this.state.form;
    let formObj = {};
    formObj[this.choice.value] = form[Object.keys(form)[0]];
    this.setState({
      ...this.state,
      form: formObj
    });
    this.props.updateForm(this.props.index, formObj);
  }

  render() {
    // form should be structured like:
    //  <currentChoice>: {
    //    <partNumberBlockIndex>: {
    //      <currentChoice>: <quantity>
    //    }
    //  }
    // where there can be any number of partNumber blocks
    const form = this.props.form;
    return (
      <div className="MachineNumberBlock">
        <span>MachineNumberBlock with index = {this.props.index}</span>
        <Input 
          refProp={(input) => { this.choice = input }}
          type="text"
          name={`machine_number_${this.props.index}`}
          value={Object.keys(this.state.form)[0]}
          placeholder="Machine Number"
          parentOnChange={this.onChange}
        />
        {
          Object.keys(form).map(key => (
            <PartNumberBlock
              key={key}
              index={key}
            />
          ))
        }
        <button onClick={this.addPartNumBlock}>Add Another Part Number</button>
      </div>
    )
  }
}

export default MachineNumberBlock;