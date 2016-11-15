import React from 'react';
import Input from '../Input';

class OrderForm extends React.Component {
  constructor(props) {
    super(props);

    this.orderObj = {};
    this.submit = this.submit.bind(this);
    // this.updateItem = this.updateItem.bind(this);
    this.clearForm = this.clearForm.bind(this);
    // using a timestamp key on the ItemForm Component means
    // we can force re-render the component simply by updating the key
    this.state = {
      form: this.props.form,
      timestamp: Date.now()
    };
  }

  componentWillUpdate(nextProps, nextState) {
    // re-render the ItemForm component with new form data
    // check if timestamp hasn't been updated in the past
    // 10 milliseconds so that infinite loop doesn't occur
    if (Date.now() - this.state.timestamp > 10) {
      this.setState({
        ...this.state,
        timestamp: Date.now(),
        form: nextProps.form
      });
    }
  }

  clearForm() {
    this.setState({
      ...this.state,
      timestamp: Date.now(),
      form: {}
    });
  }

  submit(e) {
    e.preventDefault();
    // console.log(this.orderObj);
    const orderObj = this.orderObj;
    let newObj = {};
    Object.keys(orderObj)
      .forEach(function(key) {
        newObj[key] = orderObj[key].value;
      });
    // console.log(`newObj = ${JSON.stringify(newObj, null, 2)}`);
    this.props.createNewOrder(newObj);
    this.clearForm();
  }

  // updateItem(e) {
  //   e.preventDefault();
  //   let updatedItem = {};
  //   Object.keys(this.itemObj)
  //     .forEach((key) => {
  //       updatedItem[key] = this.itemObj[key].value;
  //     });
  //   updatedItem = Object.assign(
  //     updatedItem,
  //     {},
  //     { updatedAt: Date.now() }
  //   );
  //   this.props.updateItem(this.props.form.key, updatedItem);
  //   this.clearForm();
  // }

  render() {
    const form = this.state.form || {};
    // onSubmit={form.key ? this.updateItem : this.addItem}
    return (
      <div key={this.state.timestamp} className="OrderForm">
        <form
          ref={(input) => this.orderForm = input} 
          onSubmit={this.submit}>
            <Input 
              refProp={(input) => { this.orderObj.name = input }}
              type="text"
              name="name"
              placeholder="Name"
              required={true}
              value={form.name} />
            <Input 
              refProp={(input) => { this.orderObj.cost = input }}
              type="text"
              name="cost"
              placeholder="Cost"
              required={true}
              value={form.cost} />
            <Input 
              refProp={(input) => { this.orderObj.desc = input }}
              type="text"
              name="desc"
              placeholder="Description"
              required={true}
              value={form.desc} />
            <Input 
              refProp={(input) => { this.orderObj.url = input }}
              type="text"
              name="url"
              placeholder="URL"
              required={true}
              value={form.url} />
            <Input 
              refProp={(input) => { this.orderObj.image_url = input }}
              type="text"
              name="image_url"
              placeholder="Image Url"
              required={true}
              value={form.image_url} />
            <button className="submit" type="submit">Submit</button>
        </form>
        <button className="cancel" onClick={this.clearForm}>Cancel</button>
      </div>
    )
  }

}

export default OrderForm;