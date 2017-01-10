import React from 'react';
import OrderSubList from './OrderSubList';

class OrderList extends React.Component {
  constructor(props) {
    super(props);
    this.updateOrder = this.updateOrder.bind(this);
    this.getNextStatusType = this.getNextStatusType.bind(this);
    this.promoteOrder = this.promoteOrder.bind(this);
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
    const nextStatusType = this.getNextStatusType();
    const orders = this.props.orders;
    delete orders[currentStatusType][order.id];
    if (orders[nextStatusType] === undefined){
      orders[nextStatusType] = {};
    }
    orders[nextStatusType][order.id] = order;
    this.props.setOrders(orders);
  }

  render() {

    let keyCount = 1;
    return (
      <div className="OrderList">
      {
        Object.values(this.props.orders).map((statusTypeOrders, i) => (
          <OrderSubList
            key={keyCount++}
            admin={this.props.admin}
            apiUrl={this.props.apiUrl}
            orders={statusTypeOrders}
            updateOrder={this.updateOrder}
            promoteOrder={this.promoteOrder}
            statusType={Object.keys(this.props.orders)[i]}
            getNextStatusType={this.getNextStatusType}
          />
        ))
      }
      </div>
    )
  }
}

export default OrderList;
