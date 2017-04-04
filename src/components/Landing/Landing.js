import React, { Component, PropTypes } from 'react';
import request from '../middleware/request';
import Dashboard from '../Dashboard';
import OrderList from '../OrderList';
import QuoteForm from '../QuoteForm';
import StockOrderForm from '../StockOrderForm';

import '../../css/components/Landing.css';

class Landing extends Component {
  constructor(props) {
    super(props);
    this.request = request.bind(this);
  }

  componentDidMount() {
    this.props.fetchOrders();
  }

  render() {
    return (
      <div className="main-wrapper">
        <Dashboard logout={this.props.logout} />
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
                        this.props.changeOrderView();
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
                              this.props.changeOrderView(sType);
                            }}
                          >
                            <span>
                              {
                                // capitalize the statusType
                                sType.charAt(0).toUpperCase() + sType.slice(1)
                              }
                            </span>
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
            showOtherForm={this.props.showOtherForm}
            showStockOrderForm={this.props.showStockOrderForm}
            fetchOrders={this.props.fetchOrders}
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
                    <button onClick={this.props.showOtherForm}>
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
      </div>
    );
  }
}

export default Landing;

Landing.propTypes = {
  fetchOrders: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  admin: PropTypes.bool.isRequired,
  apiUrl: PropTypes.string.isRequired,
  orders: PropTypes.shape({}).isRequired,
  viewBy: PropTypes.string.isRequired,
  toggleMessage: PropTypes.func.isRequired,
  changeOrderView: PropTypes.func.isRequired,
  setStateVal: PropTypes.func.isRequired,
  statusTypes: PropTypes.shape({}).isRequired,
  showOtherForm: PropTypes.func.isRequired,
  showStockOrderForm: PropTypes.bool.isRequired,
};
