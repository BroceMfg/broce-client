/**
 * Toggle the notifications menu (or force it to on / off)
 * @param {boolean} val - Optional, force value -- overrides toggle
 */
module.exports = function toggleNotifications(val) {
  const precondition = val !== undefined && typeof val === 'boolean';
  const showNotifMenu = precondition ? val : !this.state.showNotifMenu;
  this.setStateVal({ showNotifMenu });
};
