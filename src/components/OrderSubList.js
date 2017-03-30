import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Order from './Order';

import '../css/components/OrderSubList.css';

class OrderSubList extends React.Component {
  constructor(props) {
    super(props);
    this.toggleShowing = this.toggleShowing.bind(this);
    this.showFiveMore = this.showFiveMore.bind(this);
    this.state = {
      showing: true,
      shownOrders: {}
    };
  }

  componentDidMount() {
    this.showFiveMore();
  }

  toggleShowing() {
    this.setState({
      ...this.state,
      showing: !this.state.showing
    });
  }

  showFiveMore() {
    console.log('show five more');
    const orders = {};
    const currCount = Object.keys(this.state.shownOrders).length;
    Object.keys(this.props.orders).slice(0, currCount + 5).forEach((key) => {
      orders[key] = this.props.orders[key];
    });
    this.setState({
      ...this.state,
      shownOrders: orders
    });
  }

  render() {
    console.log(this.props.statusType);
    return (
      <div className="OrderSubList">
        {
          this.state.shownOrders && Object.keys(this.state.shownOrders).length > 0
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
                          Object.values(this.state.shownOrders).map((order) => (
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
                        {
                          (Object.keys(this.state.shownOrders).length
                            < Object.keys(this.props.orders).length)
                            ?
                              <div className="show-more-button-wrapper">
                                <button
                                  className="show-more-button"
                                  onClick={this.showFiveMore}
                                >
                                  Show More
                                </button>
                              </div>
                            : null
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
