module.exports = function showOtherForm() {
  this.props.setStateVal({
    showStockOrderForm: !this.props.showStockOrderForm
  });
};
