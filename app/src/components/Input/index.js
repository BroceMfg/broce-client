import React from 'react';
import _ from 'lodash';

class Input extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      value: this.props.value ? _.clone(this.props.value) : ''
    };
  }

  handleChange(e) {
    console.log(e.target.value);
    this.setState({
      value: e.target.value
    });
  }

  render() {
    return (
    <div className="Input">
      <input 
        ref={this.props.refProp}
        type={this.props.type}
        name={this.props.name}
        placeholder={this.props.placeholder}
        required
        value={this.state.value}
        onChange={this.handleChange} />
    </div>
    )
  }
}

export default Input;