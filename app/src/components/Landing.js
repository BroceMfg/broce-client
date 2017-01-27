import React from 'react';
import { get } from '../middleware/XMLHTTP';
import Dashboard from './Dashboard';
import OrderList from './OrderList';
import QuoteForm from './QuoteForm';
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
      let orders = {};
      JSON.parse(data).orders
        .sort((a, b) => {
          const statusTypeValues = Object.values(statusTypes);
          if (admin) {
            return statusTypeValues.indexOf(this.getStatusTypeId(a))
              - statusTypeValues.indexOf(this.getStatusTypeId(b));
          } else {
            console.log(new Date(a.createdAt).getTime())
            console.log(new Date(b.createdAt).getTime())
            console.log(
              new Date(b.createdAt).getTime()
                - new Date(a.createdAt).getTime()
            );
            return (
              new Date(b.createdAt).getTime()
                - new Date(a.createdAt).getTime()
            );
          }
        })
        .forEach((order) => {
          // if (this.props.admin) {
          if (admin) {
            const orderStatusType = getStatusType(this.getStatusTypeId(order));
            const statusType = (orderStatusType !== undefined) ? orderStatusType : 'unknown';

            orders[statusType] = orders[statusType] || {};
            orders[statusType][order.id] = order;
          } else {
            orders[new Date(order.createdAt).getTime()] = order;
          }
        });
      console.log(orders);
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
              ? <QuoteForm
                  apiUrl={this.props.apiUrl}
                  toggleMessage={toggleMessage}
                />
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
