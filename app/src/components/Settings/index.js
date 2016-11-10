import React from 'react';

class Settings extends React.Component {
  constructor(props) {
    super(props);
    
    this.returnToMain = this.returnToMain.bind(this);
  }

  returnToMain() {
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

Settings.contextTypes = {
  router: React.PropTypes.object
}

export default Settings;