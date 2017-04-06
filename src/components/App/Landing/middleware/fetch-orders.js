import request from '../../../middleware/request';

/**
 * Get the status { id: number, type: string } of an order
 * @param {Object} order - An Object representing an order (comprised of data
 * received from the API)
 */
function getOrderStatus(order) {
  // confirm order and order.Order_Statuses exist before attempting to access
  if (!(order && order.Order_Statuses)) {
    const errMsg = 'function "getStatus" in component "App" expected ' +
      'a value  for order, order.Order_Statuses, but found none.';
    this.props.setStateVal({ errMsg });
  }

  const curr = order.Order_Statuses.filter(s => s.current)[0];
  const id = curr ? curr.StatusTypeId : 0;
  return {
    id,
    type: this.props.statusTypes[id]
  };
}

/**
 * Fetch a user's orders or all orders (if admin) from the API
 */
module.exports = function fetchOrders(loading) {
  loading.on();
  request(
    'GET',
    `${this.props.apiUrl}/orders`,
    undefined,
    (data) => {
      const orders = {};
      const json = JSON.parse(data);
      if (!json.orders) {
        const errMsg = 'Lost connection to server.';
        this.props.setStateVal({ errMsg });
      }
      json.orders
        .sort((a, b) => {
          const aStatus = getOrderStatus.call(this, a);
          const bStatus = getOrderStatus.call(this, b);
          const statusTypeKeys = Object.keys(this.props.statusTypes);
          if (this.props.admin) {
            return statusTypeKeys.indexOf(`${aStatus.id}`)
              - statusTypeKeys.indexOf(`${bStatus.id}`);
          }
          return (
            new Date(b.createdAt).getTime()
              - new Date(a.createdAt).getTime()
          );
        })
        .forEach((order) => {
          const status = getOrderStatus.call(this, order);
          const newOrder = Object.assign(order, { status: status.type });
          if (this.props.admin) {
            orders[status.type] = orders[status.type] || {};
            orders[status.type][order.id] = newOrder;
          } else {
            orders[`${new Date(order.createdAt).getTime()}|${order.id}`] = newOrder;
          }
        });
      loading.off();
      this.props.setStateVal({ orders });
    },
    () => {
      // session expired or possible security vulnerability.
      // log user out and reload
      const errMsg = 'An unexpected error occurred.';
      this.props.setStateVal({ errMsg });
      setTimeout(() => { this.props.logout(); }, 1250);
    }
  );
};
