module.exports = function changeOrderView(sType) {
  const sT = sType || 'all';
  this.props.setStateVal({ viewBy: sT });
};
