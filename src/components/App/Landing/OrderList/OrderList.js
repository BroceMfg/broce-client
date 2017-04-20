import React from 'react';
import OrderSubList from '../../../OrderSubList';

import '../../../../css/components/OrderList.css';

class OrderList extends React.Component {
  constructor(props) {
    super(props);
    this.updateOrder = this.updateOrder.bind(this);
    this.getNextStatusType = this.getNextStatusType.bind(this);
    this.promoteOrder = this.promoteOrder.bind(this);
    this.renderSubLists = this.renderSubLists.bind(this);
    this.state = {
      key: this.props.orderListKey
    };
  }

  // provide a statusType OR an updatedOrder
  // statusType will take priority if provided
  // currentStatusType is used for locating the order
  updateOrder(order, statusType, updatedOrder, currentStatusType) {
    if (statusType) {
      let newList = this.props.orders[statusType];
      newList[order.id] = order;
      let newStatusTypeList = {};
      newStatusTypeList[statusType] = newList;
      this.props.setStateVal({
        orders: Object.assign(this.props.orders, {}, newStatusTypeList)
      });
    }
  }

  getNextStatusType(currentStatusType){
    const statusTypes = Object.values(this.props.statusTypes);
    return statusTypes[statusTypes.indexOf(currentStatusType) + 1];
  }

  promoteOrder(order, currentStatusType, forcedNewStatusType) {
    const orders = this.props.orders;
    const updatedOrder = order;
    let nextStatusType;
    if (forcedNewStatusType) {
      nextStatusType = forcedNewStatusType;
    }
    if (this.props.admin) {
      nextStatusType = nextStatusType || this.getNextStatusType(currentStatusType);
      delete orders[currentStatusType][order.id];
      if (!orders[currentStatusType][Object.keys(orders[currentStatusType])[0]]) {
        delete orders[currentStatusType];
      }
      orders[nextStatusType] = orders[nextStatusType] || {};
      updatedOrder.status = nextStatusType;
      orders[nextStatusType][order.id] = updatedOrder;
    } else {
      nextStatusType = nextStatusType || this.getNextStatusType(order.status);
      updatedOrder.status = nextStatusType;
      orders[new Date(order.createdAt).getTime()] = updatedOrder;
    }
    this.props.setStateVal({ orders });
    // force update
    this.props.setStateVal({ orderListKey: this.props.orderListKey + 1 });
  }

  renderSubLists() {
    let list;
    let getStatusType;
    if (this.props.admin) {
      list = Object.values(this.props.orders);
      getStatusType = (orders, i) => Object.keys(orders)[i];
    } else {
      list = [this.props.orders];
      getStatusType = () => null;
    }
    let keyCount = 1;
    return list.length > 0 && Object.keys(list[0]).length > 0
      ? (
          list.map((orders, i) => {
            const statusType = getStatusType(this.props.orders, i);
            return (
              <OrderSubList
                addresses={this.props.addresses}
                // user orderListKey in the OrderSubList key so we can force
                // re-render when we re-render OrderlList
                key={`${this.props.orderListKey}_${keyCount++}`}
                admin={this.props.admin}
                apiUrl={this.props.apiUrl}
                loading={this.props.loading}
                orders={orders}
                orderListKey={this.props.orderListKey}
                updateOrder={this.updateOrder}
                promoteOrder={this.promoteOrder}
                statesList={this.props.statesList}
                statusType={statusType}
                getNextStatusType={this.getNextStatusType}
                toggleMessage={this.props.toggleMessage}
                showOtherForm={this.props.showOtherForm}
                showStockOrderForm={this.props.showStockOrderForm}
                fetchOrders={this.props.fetchOrders}
                show={this.props.viewBy === 'all' || this.props.viewBy === statusType}
                viewByActive={this.props.viewBy === statusType}
                header={this.props.header}
                showDetails={this.props.showDetails}
              />
            );
          })
        )
    : (
      <div className="OrderSubList">
        <div>
          <h3>Currently, there are no orders to display.</h3>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div
        className={`OrderList${this.props.admin ? ' admin' : ''}`}
        key={this.state.key}
      >
        {this.renderSubLists()}
      </div>
    )
  }
}

export default OrderList;
