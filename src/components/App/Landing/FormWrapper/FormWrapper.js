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
            toggleMessage={props.toggleMessage}
          />
        :
          <QuoteForm
            apiUrl={props.apiUrl}
            toggleMessage={props.toggleMessage}
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
  showOtherForm: PropTypes.func.isRequired,
  showStockOrderForm: PropTypes.bool.isRequired,
  toggleMessage: PropTypes.func.isRequired
};
