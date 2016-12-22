import React from 'react';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.settingsOnClickHandler = this.settingsOnClickHandler.bind(this);
  }

  settingsOnClickHandler(e) {
    e.preventDefault();
    this.context.router.transitionTo('/settings');
  }

  render() {
    return (
      <div className="Dashboard">
        <h1 className="Dashboard-header">
          Welcome To Broce Parts
        </h1>
        <a
          onClick={this.settingsOnClickHandler}
          className="btn Dashboard-anchor">
          Settings
        </a>
        <a
          onClick={this.props.logout}
          className="btn Dashboard-anchor">
          Log Out
        </a>
      </div>
    )
  }
}

Dashboard.contextTypes = {
  router: React.PropTypes.object
}

export default Dashboard;