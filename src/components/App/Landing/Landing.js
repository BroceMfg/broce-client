import React, { Component, PropTypes } from 'react';

import fetchOrders from './middleware/fetch-orders';
import fetchNotifs from './middleware/fetch-notifs';
import fetchAddresses from './middleware/fetch-addresses';
import changeOrderView from './middleware/change-order-view';
import showOtherForm from './middleware/show-other-form';

import OrderDetail from '../OrderDetail/OrderDetail';
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
    fetchNotifs.call(this, this.props.loading);
    fetchAddresses.call(this, this.props.loading);
  }

  render() {
    return (
      <div
        className={`Landing${this.props.showOrderDetail
          ? ' showingOrderDetail' : ''}`}
      >
        {
          this.props.showOrderDetail
            ?
              <OrderDetail
                admin={this.props.admin}
                apiUrl={this.props.apiUrl}
                loading={this.props.loading}
                notifs={this.props.notifs}
                order={
                  this.props.admin
                    && this.props.orders
                    && (!this.props.admin || this.props.orders[this.props.showOrderDetailStatus])
                    ? this.props.orders[this.props.showOrderDetailStatus][parseInt(this.props.showOrderDetail, 10)]
                    : (() => {
                      const key = Object.keys(this.props.orders)
                        .filter(k => k.split('|')[1] === this.props.showOrderDetail)[0];
                      if (key) {
                        return this.props.orders[key];
                      }
                      return undefined;
                    })()
                }
                setStateVal={this.props.setStateVal}
                statusTypes={this.props.statusTypes}
                showOtherForm={this.showOtherForm}
                showStockOrderForm={this.props.showStockOrderForm}
                toggleMessage={this.props.toggleMessage}
                fetchNotifs={() => {
                  fetchNotifs.call(this, this.props.loading);
                }}
              />
            : null
        }
        <div className="landing-inner">
          <FilterByBar
            admin={this.props.admin}
            orderSubGroups={Object.keys(this.props.orders)}
            viewBy={this.props.viewBy}
            changeOrderView={this.changeOrderView}
          />
          <OrderList
            addresses={this.props.addresses}
            admin={this.props.admin}
            apiUrl={this.props.apiUrl}
            loading={this.props.loading}
            orders={this.props.orders}
            setStateVal={this.props.setStateVal}
            statesList={this.props.statesList}
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
      </div>
    );
  }
}

export default Landing;

Landing.propTypes = {
  addresses: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  admin: PropTypes.bool.isRequired,
  apiUrl: PropTypes.string.isRequired,
  loading: PropTypes.shape({
    on: PropTypes.func.isRequired,
    off: PropTypes.func.isRequired
  }).isRequired,
  notifs: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  orders: PropTypes.shape({}).isRequired,
  setStateVal: PropTypes.func.isRequired,
  showOrderDetail: PropTypes.string,
  showOrderDetailStatus: PropTypes.string.isRequired,
  showStockOrderForm: PropTypes.bool.isRequired,
  statesList: PropTypes.arrayOf(PropTypes.string).isRequired,
  statusTypes: PropTypes.shape({}).isRequired,
  toggleMessage: PropTypes.func.isRequired,
  viewBy: PropTypes.string.isRequired,
};

Landing.defaultProps = {
  showOrderDetail: undefined
};
