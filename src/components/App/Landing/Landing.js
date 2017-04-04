import React, { Component, PropTypes } from 'react';
import fetchOrders from './middleware/fetch-orders';
import changeOrderView from './middleware/change-order-view';
import showOtherForm from './middleware/show-other-form';

import OrderList from '../../OrderList';
import QuoteForm from '../../QuoteForm';
import StockOrderForm from '../../StockOrderForm';

import '../../../css/components/Landing.css';

class Landing extends Component {
  constructor(props) {
    super(props);
    this.changeOrderView = changeOrderView.bind(this);
    this.showOtherForm = showOtherForm.bind(this);
  }

  componentDidMount() {
    fetchOrders.call(this, this.props.loading);
  }

  render() {
    return (
      <div className="Landing">
        {
          this.props.admin && Object.keys(this.props.orders).length > 1
            ?
              <div className="filtering-options">
                <div className="filter-by-wrapper">
                  <span>Filter By:</span>
                </div>
                <div
                  className={
                    `item ${this.props.viewBy === 'all' ? 'active' : ''}`
                  }
                >
                  <button
                    onClick={() => {
                      this.changeOrderView();
                    }}
                  >
                    <span>All</span>
                  </button>
                </div>
                {
                  Object.keys(this.props.orders)
                    .map(sType => (
                      <div
                        className={
                          `item ${this.props.viewBy === sType ? 'active' : ''}`
                        }
                        key={Math.random()}
                      >
                        <button
                          onClick={() => {
                            this.changeOrderView(sType);
                          }}
                        >
                          <span>{sType}</span>
                        </button>
                      </div>
                    ))
                }
              </div>
            : null
        }
        <OrderList
          admin={this.props.admin}
          apiUrl={this.props.apiUrl}
          orders={this.props.orders}
          setStateVal={this.props.setStateVal}
          statusTypes={this.props.statusTypes}
          showOtherForm={this.showOtherForm}
          showStockOrderForm={this.props.showStockOrderForm}
          viewBy={this.props.viewBy}
          toggleMessage={this.props.toggleMessage}
        />
        {
          !this.props.admin
            ?
              <div className="quote-stock-form-wrapper">
                {
                  this.props.showStockOrderForm
                    ?
                      <StockOrderForm
                        apiUrl={this.props.apiUrl}
                      />
                    :
                      <QuoteForm
                        apiUrl={this.props.apiUrl}
                      />
                }
                <div className="show-other-button-wrapper">
                  <button onClick={this.showOtherForm}>
                    {
                      this.props.showStockOrderForm
                        ? <span>Place a Regular Quote Instead</span>
                        : <span>Place a Stock Order Instead</span>
                    }
                  </button>
                </div>
              </div>
            : null
        }
      </div>
    );
  }
}

export default Landing;

Landing.propTypes = {
  admin: PropTypes.bool.isRequired,
  apiUrl: PropTypes.string.isRequired,
  loading: PropTypes.shape({
    on: PropTypes.func.isRequired,
    off: PropTypes.func.isRequired
  }).isRequired,
  orders: PropTypes.shape({}).isRequired,
  setStateVal: PropTypes.func.isRequired,
  showStockOrderForm: PropTypes.bool.isRequired,
  statusTypes: PropTypes.shape({}).isRequired,
  toggleMessage: PropTypes.func.isRequired,
  viewBy: PropTypes.string.isRequired
};
