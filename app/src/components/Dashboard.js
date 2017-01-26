import React from 'react';

import '../css/components/Dashboard.css';

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
        <div className="content-wrapper">
          <h1 className="Dashboard-header">
            Welcome To Broce Parts
          </h1>
          <div className="button-container">
            <a
              onClick={this.settingsOnClickHandler}
              className="button">
              <span>Settings</span>
            </a>
            <a
              onClick={this.props.logout}
              className="button">
              <span>Log Out</span>
            </a>
          </div>
        </div>
      </div>
    )
  }
}

Dashboard.contextTypes = {
  router: React.PropTypes.object
}

export default Dashboard;