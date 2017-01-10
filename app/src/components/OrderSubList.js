import React from 'react';
import Order from './Order';

class OrderSubList extends React.Component {
  render() {
    return (
      <div className="Order-wrapper">
        {
          this.props.orders && Object.keys(this.props.orders).length > 0
            ?
              <div>
                <h1>{this.props.statusType}</h1>
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
                      statusType={this.props.statusType}
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
