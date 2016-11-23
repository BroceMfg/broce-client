import React from 'react';
import _ from 'lodash';
import Input from '../Input';

class QuoteForm extends React.Component {
  constructor(props) {
    super(props);
    this.form = {};
    this.submit = this.submit.bind(this);
    this.state = {
      form: this.props.form ? _.clone(this.props.form) : {}
    }
  }

  submit(e) {
    e.preventDefault();
    console.log('QuoteForm submit called');
    let form = {};
    Object.keys(this.form).forEach((key) => {
      form[key] = this.form[key].value;
    });
    console.log(JSON.stringify(form, null, 2));
  }

  render() {
    return (
      <div className="OrderForm">
        <h1>Quote Form</h1>
        <form onSubmit={this.submit}>
          <Input 
            refProp={(input) => { this.form.name = input }}
            type="text"
            name="name"
            placeholder="Name"
            value={'Andrew'} />
          <button type="submit">Submit</button>
        </form>
      </div>
    )
  }
}

export default QuoteForm;