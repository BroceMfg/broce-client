import React from 'react';
import Order from './Order';

import '../css/components/OrderSubList.css';

class OrderSubList extends React.Component {
  render() {
    console.log(this.props.statusType);
    return (
      <div className="OrderSubList">
        {
          this.props.orders && Object.keys(this.props.orders).length > 0
            ?
              <div>
                {
                  this.props.admin
                    ? <h1 className="header">
                        <span>{this.props.statusType}</span>
                      </h1>
                    : <h1 className="header">
                        <span>Your Orders</span>
                      </h1>
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
                      statusType={
                        order.status || this.props.statusType || this.props.getStatusType(order)
                      }
                      getNextStatusType={this.props.getNextStatusType}
                      toggleMessage={this.props.toggleMessage}
                      showOtherForm={this.props.showOtherForm}
                      showStockOrderForm={this.props.showStockOrderForm}
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
