/**
 * Get the status { id: number, type: string } of an order
 * @param {Object} order - An Object representing an order (comprised of data
 * received from the API)
 */
module.exports = function getOrderStatus(order) {
  // confirm order and order.Order_Statuses exist before attempting to access
  if (!(order && order.Order_Statuses)) {
    const errMsg = 'function "getStatus" in component "App" expected ' +
      'a value  for order, order.Order_Statuses, but found none.';
    this.setStateVal({ errMsg });
  }

  const curr = order.Order_Statuses.filter(s => s.current)[0];
  const id = curr ? curr.StatusTypeId : 0;
  return {
    id,
    type: this.state.statusTypes[id]
  };
};
