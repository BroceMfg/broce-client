import React, { Component, PropTypes } from 'react';

import markSeen from './middleware/mark-seen';

import OrderList from '../../App/Landing/OrderList/OrderList';

import '../../../css/components/OrderDetail.css';

class OrderDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasDoneHasSeen: false
    };
  }

  componentWillUpdate(nextProps) {
    if (nextProps.order && !this.state.hasDoneHasSeen) {
      this.setState({ ...this.state, hasDoneHasSeen: true });
      markSeen.call(this, nextProps.order.id, this.props.loading);
    }
  }

  render() {
    return (
      <div className="OrderDetail">
        {
          this.props.order
            ?
              <div className="inner-content">
                {
                  (() => {
                    const orders = {};
                    orders[this.props.order.id] = this.props.order;
                    return (
                      <OrderList
                        admin={this.props.admin}
                        apiUrl={this.props.apiUrl}
                        orders={orders}
                        setStateVal={this.props.setStateVal}
                        statusTypes={this.props.statusTypes}
                        showOtherForm={this.showOtherForm}
                        showStockOrderForm={this.props.showStockOrderForm}
                        toggleMessage={this.props.toggleMessage}
                        viewBy={'all'}
                        header={'none'}
                      />
                    );
                  })()
                }
              </div>
            :
              <div className="no-order-found">
                No order found
              </div>
        }
      </div>
    );
  }
}

export default OrderDetail;

OrderDetail.propTypes = {
  admin: PropTypes.bool.isRequired,
  apiUrl: PropTypes.string.isRequired,
  loading: PropTypes.shape({
    on: PropTypes.func.isRequired,
    off: PropTypes.func.isRequired
  }).isRequired,
  order: PropTypes.shape({
    id: PropTypes.number.isRequired
  }),
  setStateVal: PropTypes.func.isRequired,
  showStockOrderForm: PropTypes.bool.isRequired,
  statusTypes: PropTypes.shape({}).isRequired,
  toggleMessage: PropTypes.func.isRequired
};

OrderDetail.defaultProps = {
  order: undefined
};
