module.exports = function changeOrderView(sType) {
  const sT = sType || 'all';
  this.setStateVal({ viewBy: sT });
};
