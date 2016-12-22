import React from 'react';

export default (props) => (
  <div className="Order">
    <span>Machine Serial Number: {props.order.id}</span>
    <br/>
    <span>Quanitity: {props.order.po_number}</span>
    <br/>
    <span>Price: {props.order.shipping_city}</span>
  </div>
)
