import React from 'react';
import Order from '../Order';

export default (props) => (
<div className="OrderList">
  <ul>
  {
    props.orders.map(
      order =>
        <Order key={order.id || Math.random()} order={order}/>        
    )
  }
  </ul>
</div>
)
