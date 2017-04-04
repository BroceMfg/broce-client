import React, { PropTypes } from 'react';
import { Link } from 'react-router';

import '../../../css/components/Dashboard.css';

const Dashboard = props => (
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
          <Link
            className="button settings"
            to="/settings"
          />
        </div>
        <button
          onClick={props.logout}
          className="button logout"
        >
          <span>Log Out</span>
        </button>
      </div>
    </div>
  </div>
);

export default Dashboard;

Dashboard.propTypes = {
  logout: PropTypes.func.isRequired
};

Dashboard.contextTypes = {
  router: PropTypes.object
};
