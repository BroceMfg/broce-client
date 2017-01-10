import React from 'react';
import _ from 'lodash';

class Input extends React.Component {
  constructor(props) {
    super(props);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.renderInput = this.renderInput.bind(this);
    this.state = {
      value: this.props.value ? _.clone(this.props.value) : ''
    };
  }

  handleKeyPress(e) {
    if (e.charCode === 13) {
      e.preventDefault();
      
      /* TODO: decide if this is a nice feature to have
         or if it would just get annoying becauase people
         are submitting the form accidentally */

      // if (this.props.submit) {
      //   this.props.submit(e);
      // }

    }
    // prevents the 'e' character within a number input
    // but still allows for decimals
    if (this.props.type === 'number') {
      if (e.charCode !== 46 && e.charCode > 31 
        && (e.charCode < 48 || e.charCode > 57)) {
        e.preventDefault();
      }
      if (this.props.maxCharLength !== undefined) {
        if (e.target.value.length >= this.props.maxCharLength) {
          e.preventDefault();
        }
      }
    }
  }

  handleChange(e) {
    const value = e.target.value;
    this.setState({
      value
    });
    if (this.props.parentOnChange) {
      this.props.parentOnChange();
    }
  }

  renderInput() {
    let block;
    const required = this.props.required;
    if (required === undefined || required) {
      // is required
      block = (
        <input
          className={this.props.className}
          ref={this.props.refProp}
          type={this.props.type}
          name={this.props.name}
          placeholder={this.props.placeholder}
          required
          value={this.state.value}
          min={this.props.min}
          max={this.props.max}
          onChange={this.handleChange}
          onKeyPress={this.handleKeyPress} />
      );
    } else {
      // not required
      block = (
        <input
          className={this.props.className}
          ref={this.props.refProp}
          type={this.props.type}
          name={this.props.name}
          placeholder={this.props.placeholder}
          value={this.state.value}
          min={this.props.min}
          max={this.props.max}
          onChange={this.handleChange}
          onKeyPress={this.handleKeyPress} />
      );
    }
    return block;
  }

  render() {
    return (
    <div className="Input">
      {this.renderInput()}
    </div>
    )
  }
}

export default Input;