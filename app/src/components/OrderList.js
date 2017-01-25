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

  updateOrder(order, statusType) {
    let newList = this.props.orders[statusType];
    newList[order.id] = order;
    let newStatusTypeList = {};
    newStatusTypeList[statusType] = newList;
    this.props.setOrders(Object.assign(
      this.props.orders,
      newStatusTypeList
    ));
  }

  getNextStatusType(currentStatusType){
    const statusTypes = Object.values(this.props.statusTypes);
    return statusTypes[statusTypes.indexOf(currentStatusType) + 1];
  }

  promoteOrder(order, currentStatusType) {
    const nextStatusType = this.getNextStatusType(currentStatusType);
    const orders = this.props.orders;
    delete orders[currentStatusType][order.id];
    if (orders[nextStatusType] === undefined){
      orders[nextStatusType] = {};
    }
    orders[nextStatusType][order.id] = order;
    this.props.setOrders(orders);
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
    console.log(list);
    let keyCount = 1;
    return (
      <div>
        {
          list.map((orders, i) => (
            <OrderSubList
              key={keyCount++}
              admin={this.props.admin}
              apiUrl={this.props.apiUrl}
              orders={orders}
              updateOrder={this.updateOrder}
              promoteOrder={this.promoteOrder}
              statusType={getStatusType(this.props.orders, i)}
              getStatusType={this.props.getStatusType}
              getNextStatusType={this.getNextStatusType}
            />
          ))
        }
      </div>
    );
  }

  render() {
    return (
      <div className="OrderList">
        {this.renderSubLists()}
      </div>
    )
  }
}

export default OrderList;
