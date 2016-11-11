import React from 'react';
import Order from '../Order';

export default (props) => (
  <div className="OrderList">
    <ul>
    {
      Object.values(props.orders).map(
        order =>
          (
            <a
              key={order.id || Math.random()}
              className="OrderList-Order-wrapper-anchor"
              onClick={() => props.orderOnClickHandler(order.id)}>
              <Order order={order}/>
            </a>
          )
      )
    }
    </ul>
  </div>
)
