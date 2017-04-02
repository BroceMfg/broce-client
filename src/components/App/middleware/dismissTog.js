/**
 * Dismiss a toggle alert
 * @param {number} togId - The id of the tog being dismissed
 * This is used to make sure we are dismissing the current tog
 */
module.exports = function dismissTog(togId) {
  if (this.state.currTogId === togId) {
    this.setStateVal({ togStat: '' }); // keep the msg text present for the animation
    setTimeout(() => {
      this.setStateVal({ togMsg: '' });
    }, 250); // 250 corresponds to the fade out CSS animation
  }
};
