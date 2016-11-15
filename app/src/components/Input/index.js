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
  }

  render() {
    return (
    <div className="Input">
      {this.props.required ?
        <input 
          ref={this.props.refProp}
          type={this.props.type}
          name={this.props.name}
          placeholder={this.props.placeholder}
          required
          value={this.state.value}
          onChange={this.handleChange} /> :
        <input 
          ref={this.props.refProp}
          type={this.props.type}
          name={this.props.name}
          placeholder={this.props.placeholder}
          value={this.state.value}
          onChange={this.handleChange} />
      }
    </div>
    )
  }
}

export default Input;