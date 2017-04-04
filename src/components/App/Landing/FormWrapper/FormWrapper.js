import React, { PropTypes } from 'react';
import QuoteForm from './QuoteForm/QuoteForm';
import StockOrderForm from './StockOrderForm/StockOrderForm';

const FormWrapper = props => (
  <div className="quote-stock-form-wrapper">
    {
      props.showStockOrderForm
        ?
          <StockOrderForm
            apiUrl={props.apiUrl}
          />
        :
          <QuoteForm
            apiUrl={props.apiUrl}
          />
    }
    <div className="show-other-button-wrapper">
      <button onClick={props.showOtherForm}>
        {
          props.showStockOrderForm
            ? <span>Place a Regular Quote Instead</span>
            : <span>Place a Stock Order Instead</span>
        }
      </button>
    </div>
  </div>
);

export default FormWrapper;

FormWrapper.propTypes = {
  apiUrl: PropTypes.string.isRequired,
  showOtherForm: PropTypes.bool.isRequired,
  showStockOrderForm: PropTypes.bool.isRequired
};
