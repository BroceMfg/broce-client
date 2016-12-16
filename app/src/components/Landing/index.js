import React from 'react';
import Dashboard from '../Dashboard';
import OrderList from '../OrderList';
import QuoteForm from '../QuoteForm';

class Landing extends React.Component {

  constructor(props) {
    super(props);
    this.orderOnClickHandler = this.orderOnClickHandler.bind(this);
  }

  orderOnClickHandler(orderId) {
    this.context.router.transitionTo(`/orders/${orderId}`);
  }

  render() {
    return (
      <div className="main-wrapper">
        <Dashboard />
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
