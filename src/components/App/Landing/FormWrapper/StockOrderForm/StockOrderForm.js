import React, { PropTypes } from 'react';
import gnum from '../../../../../helpers/global-enum';
import QuoteForm from '../QuoteForm/QuoteForm';

import '../../../../../css/components/StockOrderForm.css';

const StockOrderForm = props => (
  <QuoteForm
    apiUrl={props.apiUrl}
    toggleMessage={props.toggleMessage}
    initialForm={gnum.INITIAL_STOCK_FORM}
    stockOrderForm
    noAddButtons={props.noAddButtons}
    submit={props.submit}
  />
);

export default StockOrderForm;

StockOrderForm.propTypes = {
  apiUrl: PropTypes.string.isRequired,
  toggleMessage: PropTypes.func.isRequired,
  noAddButtons: PropTypes.bool,
  submit: PropTypes.func
};

StockOrderForm.defaultProps = {
  noAddButtons: undefined,
  submit: undefined
};
