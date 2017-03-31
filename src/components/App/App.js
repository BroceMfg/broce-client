import React, { Component } from 'react';
import { BrowserRouter, Match, Miss } from 'react-router';
import autoBind from 'react-autobind';

import { post } from '../../middleware/XMLHTTP';
import ssv from './middleware/set-state-val';

import ErrorHandler from '../misc/ErrorHandler';
import Loading from '../misc/Loading';
import SignIn from '../SignIn';
import Landing from '../Landing';
import Settings from '../Settings';
import OrderDetail from '../OrderDetail';
import NotFound from '../NotFound';

import '../../css/components/App.css';

import defaultState from '../../default.json';

class App extends Component {
  constructor(props) {
    super(props);
    this.setStateVal = ssv.bind(this);
    autoBind(this);

    this.state = Object.assign(
      // check loclStorage for previously stored state
      JSON.parse(localStorage.getItem('state')),
      {},
      defaultState
    );
  }

  componentWillUpdate(nextProps, nextState) {
    // whenever we update, update our localStorage-stored state
    localStorage.setItem('state', JSON.stringify(nextState));
  }

  getStatus(order) {
    // confirm order and order.Order_Statuses exist before attempting to access
    if (!(order && order.Order_Statuses)) {
      const errMsg = 'function "getStatus" in component "App" expected ' +
        'a value  for order, order.Order_Statuses, but found none.';
      this.setStateVal({ errExists: true, errMsg });
    }

    const curr = order.Order_Statuses.filter(s => s.current)[0];
    const id = curr ? curr.StatusTypeId : 0;
    return {
      id,
      type: this.state.statusTypes[id]
    };
  }

  setUser(user) {
    this.setState({
      ...this.state,
      user,
      admin: this.state.userRoleTypes[user.role || 0] === 'admin'
    });
  }

  logout() {
    localStorage.clear();

    post(
      `${this.state.apiUrl}/users/logout`,
      (response) => {
        console.log(JSON.parse(response));
      },
      (errorResponse) => console.log(errorResponse)
    );
    // refresh the broswer to unmount/remount our component
    window.location.reload(false);
  }

  toggleMessage(message, statusCode) {
    let msgStatCode;
    if (statusCode === 'success' || statusCode === 'error') {
      msgStatCode = statusCode;
    }
    const toggle = (msg, msgStatCode) => this.setState({
      ...this.state,
      message: msg,
      messageStatusCode: msgStatCode
    });
    toggle(message, msgStatCode);
    setTimeout(toggle, 3000);
  }

  showOtherForm() {
    this.setState({
      ...this.state,
      showStockOrderForm: !this.state.showStockOrderForm
    });
  }

  render() {
    const {
      admin,
      fetching,
      logErrs,
      errMsg,
      defErrMsg,
      errExists,
      orders,
      apiUrl,
      user,
      message,
      messageStatusCode,
      showStockOrderForm
    } = this.state;
    return (
      <div className="App">
        {
          (() => {
            let r;
            if (errExists) {
              r = (
                <ErrorHandler
                  log={logErrs}
                  msg={errMsg || defErrMsg}
                />
              );
            } else {
              r = (
                <BrowserRouter>
                  <div>
                    {
                      user
                        ?
                          <div>
                            <Match
                              exactly
                              pattern="/"
                              render={
                                () => <Landing
                                        admin={admin}
                                        fetching={fetching}
                                        orders={orders}
                                        apiUrl={apiUrl}
                                        logout={this.logout}
                                        setStateVal={this.setStateVal}
                                        statusTypes={this.state.statusTypes}
                                        getStatus={this.getStatus}
                                        message={message}
                                        messageStatusCode={messageStatusCode}
                                        toggleMessage={this.toggleMessage}
                                        showStockOrderForm={showStockOrderForm}
                                        showOtherForm={this.showOtherForm}
                                        renderLoading={ () => <Loading /> }
                                      />
                              }
                            />
                            <Match
                              exactly
                              pattern="/settings"
                              render={() => <Settings return="/" />}
                            />
                            <Match
                              exactly
                              pattern="/orders/:id"
                              render={
                                (matchProps) => {
                                  const order = orders[matchProps.params.id];
                                  console.log(matchProps.params.id);
                                  if (order) {
                                    return (
                                      <OrderDetail
                                        order={order}
                                        actionTitle={'FOOBAR'}
                                        actionHandler={
                                          () => this.orderDetailAction()
                                        } />
                                    )
                                  } else {
                                    return (
                                      <NotFound />
                                    )
                                  }
                                }
                              }
                            />
                          </div>
                        :
                          <Match
                            exactly
                            pattern="/"
                            render={() => <SignIn
                                            apiUrl={apiUrl}
                                            setUser={this.setUser}
                                            message={message}
                                            messageStatusCode={messageStatusCode}
                                            toggleMessage={this.toggleMessage}
                                          />
                            }
                          />
                    }
                    <Miss component={NotFound} />
                  </div>
                </BrowserRouter>
              );
            }
            return r;
          })()
        }
      </div>
    );
  }
}

export default App;
