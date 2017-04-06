import React, { PropTypes } from 'react';
import { Link } from 'react-router';

import NotifMenu from './NotifMenu/NotifMenu';

import '../../../css/components/Dashboard.css';

const Dashboard = props => (
  <div className="Dashboard">
    <div className="content-wrapper">
      <h1 className="Dashboard-header">
        <a href="/">Broce Parts</a>
      </h1>
      <div className="button-container">
        <div className="icon-buttons-wrapper">
          <a
            className="button dashboard-controls-button home"
            href="/"
          >
            <div className="icon-wrapper">
              <i className="mdi mdi-home"></i>
            </div>
          </a>
          <button
            onClick={() => {
              window.location.reload(true);
            }}
            className="button dashboard-controls-button refresh"
            title="refresh"
          >
            <div className="icon-wrapper">
              <i className="mdi mdi-refresh" />
            </div>
          </button>
          <button
            onClick={props.togNotifMenu}
            title="notifications"
            className="button dashboard-controls-button notifications"
          >
            <div className="icon-wrapper">
              <i className="mdi mdi-bell-outline" />
              {
                props.notifs.filter(n => n.new).length > 0
                  ?
                    <div className="new-notifs-count">
                      {props.notifs.filter(n => n.new).length}
                    </div>
                  : null
              }
              {
                props.showNotifMenu
                  ? <NotifMenu admin={props.admin} notifs={props.notifs} />
                  : null
              }
            </div>
          </button>
          <Link
            className="button dashboard-controls-button settings"
            to="/settings"
            title="settings"
          >
            <div className="icon-wrapper">
              <i className="mdi mdi-settings" />
            </div>
          </Link>
        </div>
        <button
          onClick={props.logout}
          className="button logout"
          title="logout"
        >
          <span>Log Out</span>
        </button>
      </div>
    </div>
  </div>
);

export default Dashboard;

Dashboard.propTypes = {
  admin: PropTypes.bool.isRequired,
  logout: PropTypes.func.isRequired,
  showNotifMenu: PropTypes.bool.isRequired,
  togNotifMenu: PropTypes.func.isRequired,
  notifs: PropTypes.arrayOf(PropTypes.shape({})).isRequired
};

Dashboard.defaultProps = {
  admin: false
};

Dashboard.contextTypes = {
  router: PropTypes.object
};
