import React from 'react';

import '../css/components/StockOrderForm.css';

class StockOrderForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div className="StockOrderForm">
        <div className="content-wrapper">
          <h1>Hello StockOrderForm</h1>
        </div>
      </div>
    );
  }
}

export default StockOrderForm;
