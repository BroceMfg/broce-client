function on() {
  this.setStateVal({ loading: true });
}

function off() {
  this.setStateVal({ loading: false });
}

module.exports = function loading() {
  return {
    on: on.bind(this),
    off: off.bind(this)
  };
};
