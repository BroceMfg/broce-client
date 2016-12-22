import React from 'react';
import Order from './Order';

class OrderList extends React.Component {
  render() {

    const subList = (props) => (
      <div key={props.key || Math.random()} className="Order-wrapper">
        <h1>{props.title}</h1>
        <ul>
        {
          Object.values(props.orders).map(order => (

            <a
              key={order.id || Math.random()}
              className="OrderList-Order-wrapper-anchor"
              onClick={() => this.props.orderOnClickHandler(order.id)}>
              <Order order={order}/>
            </a>

          ))
        }
        </ul>
      </div>
    )

    let keyCount = 1;
    return (
      <div className="OrderList">
      {
        Object.values(this.props.orders).map((statusTypeOrders, i) => subList({
          key: keyCount++,
          title: Object.keys(this.props.orders)[i],
          orders: statusTypeOrders
        }))
      }
      </div>
    )
  }
}

export default OrderList;
