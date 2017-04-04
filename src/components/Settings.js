import React from 'react';

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.returnToMain = this.returnToMain.bind(this);
  }

  returnToMain() {
    console.log('hello world');
    this.context.router.transitionTo(this.props.return);
  }

  render() {
    return (
      <div className="Settings">
        <button onClick={this.returnToMain}>Back</button>
        <span>Settings View</span>
      </div>
    )
  }
}

export default Settings;

Settings.contextTypes = {
  router: React.PropTypes.object
};
