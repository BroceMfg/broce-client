import React from 'react';
import Order from './Order';

class OrderSubList extends React.Component {
  render() {
    return (
      <div className="Order-wrapper">
        <h1>{this.props.statusType}</h1>
        <ul>
        {
          Object.values(this.props.orders).map(order => (
            <Order
              admin={this.props.admin}
              apiUrl={this.props.apiUrl}
              key={order.id || Math.random()}
              order={order}
              updateOrder={this.props.updateOrder}
              statusType={this.props.statusType}
            />
          ))
        }
        </ul>
      </div>
    )
  }
}

export default OrderSubList;