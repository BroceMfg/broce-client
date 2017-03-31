/**
 * Set the App state (this is the main state container for the application).
 * @param {Object} obj - An Object containing key/value pairs
 * for the state values we wish to modify or create
 */
module.exports = function setStateVal(obj) {
  // use Object.assign to copy our old state and overwrite it only where we want to
  this.setState(Object.assign(this.state, {}, obj));
};
