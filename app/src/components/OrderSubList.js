import React from 'react';
import Order from './Order';

class OrderSubList extends React.Component {
  render() {
    console.log(this.props.statusType);
    return (
      <div className="Order-wrapper">
        {
          this.props.orders && Object.keys(this.props.orders).length > 0
            ?
              <div>
                {
                  this.props.admin
                    ? <h1>{this.props.statusType}</h1>
                    : null
                }
                <ul>
                {
                  Object.values(this.props.orders).map((order) => (
                    <Order
                      admin={this.props.admin}
                      apiUrl={this.props.apiUrl}
                      key={order.id || Math.random()}
                      order={order}
                      updateOrder={this.props.updateOrder}
                      promoteOrder={this.props.promoteOrder}
                      statusType={this.props.statusType || this.props.getStatusType(order)}
                      getNextStatusType={this.props.getNextStatusType}
                    />
                  ))
                }
                </ul>
              </div>
            : null
        }
      </div>
    )
  }
}

export default OrderSubList;
