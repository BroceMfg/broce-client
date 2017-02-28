import React from 'react';
import _ from 'lodash';
import gnum from '../helpers/global-enum';
import QuoteForm from './QuoteForm';

import '../css/components/StockOrderForm.css';

class StockOrderForm extends React.Component {
  constructor(props) {
    super(props);
    this.getInitialForm = this.getInitialForm.bind(this);
  }

  getInitialForm() {
    return _.cloneDeep(gnum.INITIAL_STOCK_FORM);
  }

  render() {
    return (
      <QuoteForm
        apiUrl={this.props.apiUrl}
        toggleMessage={this.props.toggleMessage}
        getInitialForm={this.getInitialForm}
        stockOrderForm={true}
      />
    );
  }
}

export default StockOrderForm;
