import React from 'react';

class ShippingDetail extends React.Component {
  render() {
    const shippingDetail = this.props.shippingDetail;
    return (
      <div className="ShippingDetail">
        <h4>Shippign Details</h4>
        <div>Tracking Number: {shippingDetail.tracking_number}</div>
        <div>Cost: {shippingDetail.cost}</div>
      </div>
    );
  }
}

export default ShippingDetail;
