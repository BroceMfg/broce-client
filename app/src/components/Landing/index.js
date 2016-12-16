import React from 'react';
import { get } from '../../middleware/XMLHTTP';
import Dashboard from '../Dashboard';
import OrderList from '../OrderList';
import QuoteForm from '../QuoteForm';

class Landing extends React.Component {

  constructor(props) {
    super(props);
    this.orderOnClickHandler = this.orderOnClickHandler.bind(this);
  }

  componentWillMount() {
    const cb = (data) => {
      let orders = {};
      JSON.parse(data).orders.forEach((order) => {

        const orderStatusType = this.props.statusTypes[order.Order_Statuses[0].StatusTypeId || 0];
        const statusType = (orderStatusType !== undefined) ? orderStatusType : 'unknown';

        orders[statusType] = orders[statusType] || {};
        orders[statusType][order.id] = order;

      });
      this.props.setOrders(orders);
    }

    get(
      `${this.props.apiUrl}/orders?status=quote,priced`,
      (data) => cb(data),
      (err) => console.log(err)
    );
  }

  orderOnClickHandler(orderId) {
    this.context.router.transitionTo(`/orders/${orderId}`);
  }

  render() {
    return (
      <div className="main-wrapper">
        <Dashboard logout={this.props.logout} />
        <div className="Landing">
          <OrderList
            orders={this.props.orders}
            orderOnClickHandler={this.orderOnClickHandler} />
          <QuoteForm apiUrl={this.props.apiUrl} />
        </div>
      </div>
    )
  }
}

Landing.contextTypes = {
  router: React.PropTypes.object.isRequired,
};

export default Landing;
