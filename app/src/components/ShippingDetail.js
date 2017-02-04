import React from 'react';

import '../css/components/ShippingDetail.css';

class ShippingDetail extends React.Component {
  render() {
    const shippingDetail = this.props.shippingDetail;
    return (
      <div className="ShippingDetail">
        <button id="ShippingDetailHide" onClick={this.props.hide}><span>X</span></button>
        <h4>Shipping Details</h4>
        <div>Tracking Number: {shippingDetail.tracking_number}</div>
        <div>Cost: {shippingDetail.cost}</div>
      </div>
    );
  }
}

export default ShippingDetail;
