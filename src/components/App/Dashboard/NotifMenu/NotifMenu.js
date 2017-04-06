import React, { PropTypes } from 'react';

import '../../../../css/components/NotifMenu.css';

const NotifMenu = props => (
  <div className="NotifMenu">
    <div className="inner-content">
      {
        props.notifs.length > 0
          ?
            props.notifs.map(n => (
              <div
                key={Math.random()}
                className="notif"
              >
                hello notif
              </div>
            ))
          :
            <div className="no-notifs">
              No New Notifications
            </div>
      }
    </div>
  </div>
);

export default NotifMenu;

NotifMenu.propTypes = {
  notifs: PropTypes.arrayOf(PropTypes.shape({})).isRequired
};
