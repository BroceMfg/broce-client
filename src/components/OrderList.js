import React from 'react';
import OrderSubList from './OrderSubList';

import '../css/components/OrderList.css';

class OrderList extends React.Component {
  constructor(props) {
    super(props);
    this.updateOrder = this.updateOrder.bind(this);
    this.getNextStatusType = this.getNextStatusType.bind(this);
    this.promoteOrder = this.promoteOrder.bind(this);
    this.renderSubLists = this.renderSubLists.bind(this);
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
      this.setStateVal({
        orders: Object.assign(this.props.orders, {}, newStatusTypeList)
      });
    } else if (updatedOrder && currentStatusType) {
      const subList = this.props.orders[currentStatusType];
      console.log(subList);
    }
  }

  getNextStatusType(currentStatusType){
    const statusTypes = Object.values(this.props.statusTypes);
    return statusTypes[statusTypes.indexOf(currentStatusType) + 1];
  }

  promoteOrder(order, currentStatusType) {
    const orders = this.props.orders;
    const updatedOrder = order;
    if (this.props.admin) {
      const nextStatusType = this.getNextStatusType(currentStatusType);
      delete orders[currentStatusType][order.id];
      if (orders[currentStatusType][0] === undefined) {
        delete orders[currentStatusType];
      }
      orders[nextStatusType] = orders[nextStatusType] || {};
      updatedOrder.status = nextStatusType;
      orders[nextStatusType][order.id] = updatedOrder;
    } else {
      updatedOrder.status = this.getNextStatusType(order.status)
      orders[new Date(order.createdAt).getTime()] = updatedOrder;
    }
    this.props.setStateVal({ orders });
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
                key={keyCount++}
                admin={this.props.admin}
                apiUrl={this.props.apiUrl}
                orders={orders}
                updateOrder={this.updateOrder}
                promoteOrder={this.promoteOrder}
                statusType={statusType}
                getNextStatusType={this.getNextStatusType}
                toggleMessage={this.props.toggleMessage}
                showOtherForm={this.props.showOtherForm}
                showStockOrderForm={this.props.showStockOrderForm}
                fetchOrders={this.props.fetchOrders}
                show={this.props.viewBy === 'all' || this.props.viewBy === statusType}
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
    console.log('@@@@@@@');
    console.log(this.props.orders);
    console.log('@@@@@@@');
    return (
      <div className={`OrderList${this.props.admin ? ' admin' : ''}`}>
        {this.renderSubLists()}
      </div>
    )
  }
}

export default OrderList;
