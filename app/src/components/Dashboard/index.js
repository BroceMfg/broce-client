import React from 'react';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.onClickHandler = this.onClickHandler.bind(this);
  }

  onClickHandler(e) {
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
          onClick={this.onClickHandler}
          className="btn Dashboard-anchor">
          Settings
        </a>
      </div>
    )
  }
}

Dashboard.contextTypes = {
  router: React.PropTypes.object
}

export default Dashboard;