import React from 'react';

class Input extends React.Component {
  constructor(props) {
    super(props);
    
    this.handleChange = this.handleChange.bind(this);
    const value = this.props.value || '';
    this.state = { value };
  }

  handleChange(element) {
    this.setState({
      value: element.target.value
    });
    this.props.parentHandleChange(element);
  }

  render() {
    return (
    <div className="Input">
      {this.props.required ?
        <input
          id={this.props.id}
          ref={this.props.refProp}
          type={this.props.type}
          name={this.props.name}
          placeholder={this.props.placeholder}
          required
          value={this.state.value}
          min={this.props.min}
          onChange={this.handleChange} /> :
        <input
          id={this.props.id}
          ref={this.props.refProp}
          type={this.props.type}
          name={this.props.name}
          placeholder={this.props.placeholder}
          value={this.state.value}
          min={this.props.min}
          onChange={this.handleChange} />
      }
    </div>
    )
  }
}

export default Input;