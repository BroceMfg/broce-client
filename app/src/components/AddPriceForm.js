import React from 'react';

class AddPriceForm extends React.Component {
  render() {
    const {
      parts
    } = this.props;
    return (
      <div className="AddPriceForm">
        <span>add price form</span>
        <ul>
          {
            parts.map((part) => (
              <div key={Math.random()}>
                <div>number: {part.number}</div>
              </div>
            ))
          }
        </ul>
      </div>
    )
  }
}

export default AddPriceForm;
