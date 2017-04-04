module.exports = function fetchOrders() {
  this.loading.on();
  this.request(
    'GET',
    `${this.state.apiUrl}/orders`,
    undefined,
    (data) => {
      const orders = {};
      const json = JSON.parse(data);
      if (!json.orders) {
        const errMsg = 'Lost connection to server.';
        this.setStateVal({ errMsg });
      }
      json.orders
        .sort((a, b) => {
          const aStatus = this.getOrderStatus(a);
          const bStatus = this.getOrderStatus(b);
          const statusTypeKeys = Object.keys(this.state.statusTypes);
          if (this.state.admin) {
            return statusTypeKeys.indexOf(`${aStatus.id}`)
              - statusTypeKeys.indexOf(`${bStatus.id}`);
          }
          return (
            new Date(b.createdAt).getTime()
              - new Date(a.createdAt).getTime()
          );
        })
        .forEach((order) => {
          const status = this.getOrderStatus(order);
          const newOrder = Object.assign(order, { status: status.type });
          if (this.state.admin) {
            orders[status.type] = orders[status.type] || {};
            orders[status.type][order.id] = newOrder;
          } else {
            orders[new Date(order.createdAt).getTime()] = newOrder;
          }
        });
      this.loading.off();
      this.setStateVal({ orders });
    },
    () => {
      // session expired or possible security vulnerability.
      // log user out and reload
      const errMsg = 'An unexpected error occurred.';
      this.setStateVal({ errMsg });
      setTimeout(() => { this.props.logout(); }, 1250);
    }
  );
};
