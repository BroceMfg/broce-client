import React, { Component } from 'react';
import { BrowserRouter, Match, Miss } from 'react-router';
import autoBind from 'react-autobind';

import req from '../middleware/request';
import ssv from './middleware/set-state-val';
import sub from '../middleware/submit';
import getOrderStatus from './middleware/get-order-status';

import TogAlert from '../misc/TogAlert';
import ErrorHandler from '../misc/ErrorHandler';
import Loading from '../misc/Loading';
import SignIn from '../SignIn/SignIn';
import Landing from '../Landing';
import Settings from '../Settings';
import OrderDetail from '../OrderDetail';
import NotFound from '../NotFound';

import '../../css/components/App.css';

import defaultState from '../../default.json';

class App extends Component {
  constructor(props) {
    super(props);
    this.request = req.bind(this);
    this.setStateVal = ssv.bind(this);
    this.submit = sub.bind(this);
    this.getOStatus = getOrderStatus.bind(this);
    autoBind(this);

    this.state = Object.assign(
      // check loclStorage for previously stored state
      JSON.parse(localStorage.getItem('state')) || {},
      defaultState
    );
  }

  componentWillUpdate(nextProps, nextState) {
    // whenever we update, update our localStorage-stored state
    localStorage.setItem('state', JSON.stringify(nextState));
  }

  logout() {
    localStorage.clear();

    this.request(
      'POST',
      `${this.state.apiUrl}/users/logout`,
      undefined,
      (response) => {
        console.log(JSON.parse(response));
      },
      (errorResponse) => {
        console.log(errorResponse);
      }
    );
    // refresh the broswer to unmount/remount our component
    window.location.reload(false);
  }

  dismissTog(togId) {
    if (this.state.currTogId === togId) {
      this.setStateVal({ togStat: '' }); // keep the msg text present for the animation
      setTimeout(() => {
        this.setStateVal({ togMsg: '' });
      }, 250); // 250 corresponds to the fade out CSS animation
    }
  }

  toggleMessage(msg, status, time) {
    this.setStateVal({
      togMsg: msg || this.state.defErrMsg,
      togStat: status,
      currTogId: this.state.currTogId + 1
    });

    // set the timeout for the TogAlert to hide itself again
    const t = time && typeof time === 'number' ? time : this.state.defTogTime;
    const togId = this.state.currTogId;
    setTimeout(() => {
      this.dismissTog(togId);
    }, t);
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
      fetchingOrders,
      logErrs,
      errMsg,
      defErrMsg,
      togMsg,
      togStat,
      orders,
      apiUrl,
      user,
      message,
      messageStatusCode,
      showStockOrderForm
    } = this.state;
    return (
      <div className="App">
        <TogAlert
          msg={togMsg}
          status={togStat}
          dismiss={() => {
            const togId = this.state.currTogId;
            this.dismissTog(togId);
          }}
        />
        {
          (() => {
            if (errMsg) {
              return (
                <ErrorHandler
                  log={logErrs}
                  msg={errMsg}
                  defErrMsg={defErrMsg}
                />
              );
            }
            return (
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
                                      fetchingOrders={fetchingOrders}
                                      orders={orders}
                                      apiUrl={apiUrl}
                                      logout={this.logout}
                                      setStateVal={this.setStateVal}
                                      statusTypes={this.state.statusTypes}
                                      getOStatus={this.getOStatus}
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
                          render={() =>
                            <SignIn
                              submit={this.submit}
                              setStateVal={this.setStateVal}
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
          })()
        }
      </div>
    );
  }
}

export default App;
