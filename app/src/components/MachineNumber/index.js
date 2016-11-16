import React from 'react';

class MachineNumber extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.state = {};
  }

  handleChange(e) {
    const newValue = e.target.options[e.target.selectedIndex].value;
    console.log(`handleChange function called with value: ${newValue}`);
  }

  render() {
    const machineNumbers = this.props.machineNumbers;
    const machNumKeys = Object.keys(machineNumbers);
    console.log(`this.props.value = ${this.props.value}`);
    console.log(this.props.machineNumbers);
    return (
      <div className="MachineNumber">
        <select id={this.props.id} selected={this.props.value} onChange={this.handleChange}>
          <option value="default">--machine number--</option>
          {
            machNumKeys.map(machNum => (
              <option key={machNum} value={machNum}>{machNum}</option>
            ))
          }
        </select>
      </div>
    )
  }
}

export default MachineNumber;