import React, { Component, PropTypes } from 'react';
import fetchOrders from './middleware/fetch-orders';
import changeOrderView from './middleware/change-order-view';
import showOtherForm from './middleware/show-other-form';

import FilterByBar from './FilterByBar/FilterByBar';
import OrderList from './OrderList/OrderList';
import FormWrapper from './FormWrapper/FormWrapper';

import '../../../css/components/Landing.css';

class Landing extends Component {
  constructor(props) {
    super(props);
    this.changeOrderView = changeOrderView.bind(this);
    this.showOtherForm = showOtherForm.bind(this);
  }

  componentDidMount() {
    fetchOrders.call(this, this.props.loading);
  }

  render() {
    return (
      <div className="Landing">
        <FilterByBar
          admin={this.props.admin}
          orderSubGroups={Object.keys(this.props.orders)}
          viewBy={this.props.viewBy}
          changeOrderView={this.changeOrderView}
        />
        <OrderList
          admin={this.props.admin}
          apiUrl={this.props.apiUrl}
          orders={this.props.orders}
          setStateVal={this.props.setStateVal}
          statusTypes={this.props.statusTypes}
          showOtherForm={this.showOtherForm}
          showStockOrderForm={this.props.showStockOrderForm}
          viewBy={this.props.viewBy}
          toggleMessage={this.props.toggleMessage}
        />
        {
          !this.props.admin
            ?
              <FormWrapper
                apiUrl={this.props.apiUrl}
                showOtherForm={this.showOtherForm}
                showStockOrderForm={this.props.showStockOrderForm}
                toggleMessage={this.props.toggleMessage}
              />
            : null
        }
      </div>
    );
  }
}

export default Landing;

Landing.propTypes = {
  admin: PropTypes.bool.isRequired,
  apiUrl: PropTypes.string.isRequired,
  loading: PropTypes.shape({
    on: PropTypes.func.isRequired,
    off: PropTypes.func.isRequired
  }).isRequired,
  orders: PropTypes.shape({}).isRequired,
  setStateVal: PropTypes.func.isRequired,
  showStockOrderForm: PropTypes.bool.isRequired,
  statusTypes: PropTypes.shape({}).isRequired,
  toggleMessage: PropTypes.func.isRequired,
  viewBy: PropTypes.string.isRequired
};
