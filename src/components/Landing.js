import React from 'react';
import { get } from '../middleware/XMLHTTP';
import Dashboard from './Dashboard';
import OrderList from './OrderList';
import QuoteForm from './QuoteForm';
import StockOrderForm from './StockOrderForm';
import ToggledMessage from './ToggledMessage';

import '../css/components/Landing.css';

class Landing extends React.Component {

  constructor(props) {
    super(props);
    this.getStatusTypeId = this.getStatusTypeId.bind(this);
  }

  componentWillMount() {
    const {
      admin,
      statusTypes,
      getStatusType,
      setOrders,
      apiUrl
    } = this.props;

    // clear out whatever message was being displayed
    this.props.toggleMessage();

    const cb = (data) => {
      const orders = {};
      const json = JSON.parse(data);
      if (!json.orders) {
        this.props.logout();
      }
      json.orders
        .sort((a, b) => {
          const statusTypeValues = Object.values(statusTypes);
          if (admin) {
            return statusTypeValues.indexOf(this.getStatusTypeId(a))
              - statusTypeValues.indexOf(this.getStatusTypeId(b));
          }
          return (
            new Date(b.createdAt).getTime()
              - new Date(a.createdAt).getTime()
          );
        })
        .forEach((order) => {
          // if (this.props.admin) {
          const orderStatusType = getStatusType(this.getStatusTypeId(order));
          const statusType = (orderStatusType !== undefined) ? orderStatusType : 'unknown';
          const newOrder = Object.assign(
            order,
            {
              status: statusType
            }
          );
          if (admin) {
            orders[statusType] = orders[statusType] || {};
            orders[statusType][order.id] = newOrder;
          } else {
            orders[new Date(order.createdAt).getTime()] = newOrder;
          }
        });
      setOrders(orders);
    }
    get(
      `${apiUrl}/orders?status=quote,priced`,
      (data) => cb(data),
      (err) => {
        console.log(`err = ${err}`);
        // session expired or possible security vulnerability.
        // log user out and reload
        this.props.logout();
      }
    );
  }

  getStatusTypeId(order) {
    return order.Order_Statuses
      .filter(
        status => status.current
      )[0].StatusTypeId || 0;
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
          <OrderList
            admin={this.props.admin}
            apiUrl={this.props.apiUrl}
            orders={this.props.orders}
            setOrders={this.props.setOrders}
            statusTypes={this.props.statusTypes}
            getStatusType={
              (order) => this.props.getStatusType(this.getStatusTypeId(order))
            }
            toggleMessage={toggleMessage}
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