import React, { PropTypes } from 'react';
import { Link } from 'react-router';

import '../../../../css/components/NotifMenu.css';

const NotifMenu = props => (
  <div className="NotifMenu">
    <div className="inner-content">
      {
        props.notifs.length > 0
          ?
            props.notifs.map(n => (
              <Link
                to={`/orders/${n.OrderId}/${n.status}`}
                key={Math.random()}
                className="notif"
                title={`Go To Order #${n.OrderId}`}
              >
                <div className={`new-wrapper${n.new ? ' new' : ''}`}>-</div>
                <div className="order-id-wrapper">
                  <span className="order-id">Order #{n.OrderId}</span>
                </div>
                <div className="order-status-wrapper">
                  <span className="order-status">
                    {
                      (() => {
                        if (n.status === 'quote') {
                          return 'New Quote';
                        }
                        return `Has been ${n.status}`;
                      })()
                    }
                  </span>
                </div>
              </Link>
            ))
          :
            <div className="no-notifs">
              No Notifications to Show
            </div>
      }
    </div>
  </div>
);

export default NotifMenu;

NotifMenu.propTypes = {
  admin: PropTypes.bool.isRequired,
  notifs: PropTypes.arrayOf(PropTypes.shape({})).isRequired
};
