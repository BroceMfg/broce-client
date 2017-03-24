import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Order from './Order';

import '../css/components/OrderSubList.css';

class OrderSubList extends React.Component {
  constructor(props) {
    super(props);
    this.toggleShowing = this.toggleShowing.bind(this);
    this.state = {
      showing: true
    };
  }

  toggleShowing() {
    this.setState({
      ...this.state,
      showing: !this.state.showing
    });
  }

  render() {
    console.log(this.props.statusType);
    return (
      <div className="OrderSubList">
        {
          this.props.orders && Object.keys(this.props.orders).length > 0
            ?
              <div>
                {
                  this.props.admin
                    ? <h1 className="header status-type-header">
                        <span>{this.props.statusType}</span>
                        <div
                          className="reveal-hide-button-wrapper"
                          title={this.state.showing ? 'hide' : 'show'}
                        >
                          <button onClick={this.toggleShowing}>
                            {
                              this.state.showing
                                ?
                                  <span>
                                    <i className="mdi mdi-chevron-down"></i>
                                  </span>
                                :
                                  <span>
                                    <i className="mdi mdi-chevron-left"></i>
                                  </span>
                            }
                          </button>
                        </div>
                      </h1>
                    : <h1 className="header">
                        <span>Your Orders</span>
                      </h1>
                }
                <ReactCSSTransitionGroup
                  className={
                    `OrderSubList-transition-wrapper ${this.state.showing ? 'shown' : 'hidden'}`
                  }
                  component="div"
                  transitionName="OrderSubList-transition"
                  transitionEnterTimeout={350}
                  transitionLeaveTimeout={350}
                >
                  {
                    this.state.showing
                      ?
                        <ul>
                        {
                          Object.values(this.props.orders).map((order) => (
                            <Order
                              admin={this.props.admin}
                              apiUrl={this.props.apiUrl}
                              key={order.id || Math.random()}
                              order={order}
                              updateOrder={this.props.updateOrder}
                              promoteOrder={this.props.promoteOrder}
                              statusType={
                                order.status || this.props.statusType || this.props.getStatusType(order)
                              }
                              getNextStatusType={this.props.getNextStatusType}
                              toggleMessage={this.props.toggleMessage}
                              showOtherForm={this.props.showOtherForm}
                              showStockOrderForm={this.props.showStockOrderForm}
                              fetchOrders={this.props.fetchOrders}
                            />
                          ))
                        }
                        </ul>
                      : null
                  }
                </ReactCSSTransitionGroup>
              </div>
            : null
        }
      </div>
    )
  }
}

export default OrderSubList;
