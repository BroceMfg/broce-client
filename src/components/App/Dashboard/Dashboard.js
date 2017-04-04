import React from 'react';

import '../../../css/components/Dashboard.css';

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
            <a href="/">Broce Parts</a>
          </h1>
          <div className="button-container">
            <div className="icon-buttons-wrapper">
              <button
                onClick={() => {
                  window.location.reload(true);
                }}
                className="button refresh"
              />
              <button
                onClick={this.settingsOnClickHandler}
                className="button settings"
              />
            </div>
            <button
              onClick={this.props.logout}
              className="button logout">
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export default Dashboard;

Dashboard.contextTypes = {
  router: React.PropTypes.object
};
