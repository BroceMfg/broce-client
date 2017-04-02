import React from 'react';
import req from '../middleware/request';
import Dashboard from '../Dashboard';
import OrderList from '../OrderList';
import QuoteForm from '../QuoteForm';
import StockOrderForm from '../StockOrderForm';
import ToggledMessage from '../ToggledMessage';

import '../../css/components/Landing.css';

class Landing extends React.Component {
  constructor(props) {
    super(props);
    this.changeView = this.changeView.bind(this);
    this.request = req.bind(this);
    this.state = {
      viewBy: 'all',
    };
  }

  componentDidMount() {
    this.props.fetchOrders();
  }

  changeView(sType) {
    const sT = sType || 'all';
    this.setState({
      ...this.state,
      viewBy: sT
    });
  }

  render() {
    const {
      message,
      messageStatusCode,
      toggleMessage
    } = this.props;
    return (
      <div className="main-wrapper">
        {
          message
            ?
              <ToggledMessage
                message={message}
                messageStatusCode={messageStatusCode}
                dismiss={() => toggleMessage()}
              />
            : null
        }
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
                      `item ${this.state.viewBy === 'all' ? 'active' : ''}`
                    }
                  >
                    <button
                      onClick={() => { this.changeView(); }}
                    >
                      <span>All</span>
                    </button>
                  </div>
                  {
                    Object.keys(this.props.orders)
                      .map(sType => (
                        <div
                          className={
                            `item ${this.state.viewBy === sType ? 'active' : ''}`
                          }
                          key={Math.random()}>
                          <button
                            onClick={() => { this.changeView(sType); }}
                          >
                            <span>
                              {sType.charAt(0).toUpperCase() + sType.slice(1)}
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
            toggleMessage={toggleMessage}
            showOtherForm={this.props.showOtherForm}
            showStockOrderForm={this.props.showStockOrderForm}
            fetchOrders={this.props.fetchOrders}
            fetchingOrders={this.props.fetchingOrders}
            viewBy={this.state.viewBy}
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
                          toggleMessage={toggleMessage}
                        />
                      :
                        <QuoteForm
                          apiUrl={this.props.apiUrl}
                          toggleMessage={toggleMessage}
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
    )
  }
}

Landing.contextTypes = {
  router: React.PropTypes.object.isRequired,
};

export default Landing;
