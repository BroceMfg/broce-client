/**
 * Set a toggle alert
 * @param {string} msg - The message to be displayed
 * @param {string} status - The status type of the alert
 * (e.g. 'success' or 'error')
 * @param {number} time - the time in ms before the alert is dismissed
 * (defaults to the state.defTogTime)
 */
module.exports = function toggleMessage(msg, status, time) {
  this.setStateVal({
    togMsg: msg || this.state.defErrMsg,
    togStat: status,
    currTogId: this.state.currTogId + 1
  });

  // set the timeout for the TogAlert to hide itself again
  const t = time && typeof time === 'number' ? time : this.state.defTogTime;
  const togId = this.state.currTogId;
  setTimeout(() => {
    this.dismissTog(togId);
  }, t);
};
