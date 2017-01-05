import React from 'react';
import OrderSubList from './OrderSubList';

class OrderList extends React.Component {
  constructor(props) {
    super(props);
    this.updateOrder = this.updateOrder.bind(this);
  }

  updateOrder(order) {
    let newQuotes = this.props.orders.quote;
    newQuotes[order.id] = order;
    this.props.setOrders({
      ...this.props.orders,
      quote: newQuotes
    });
  }

  render() {

    let keyCount = 1;
    return (
      <div className="OrderList">
      {
        Object.values(this.props.orders).map((statusTypeOrders, i) => (
          <OrderSubList
            key={keyCount++}
            admin={this.props.admin}
            apiUrl={this.props.apiUrl}
            orders={statusTypeOrders}
            updateOrder={this.updateOrder}
            statusType={Object.keys(this.props.orders)[i]}
          />
        ))
      }
      </div>
    )
  }
}

export default OrderList;
