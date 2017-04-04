import React, { Component } from 'react';
import { BrowserRouter, Match, Miss } from 'react-router';
import autoBind from 'react-autobind';

import dismissTog from './middleware/dismiss-tog';
import toggleMessage from './middleware/toggle-message';
import request from '../middleware/request';
import submit from '../middleware/submit';
import setStateVal from './middleware/set-state-val';
import showOtherForm from './middleware/show-other-form';
import getOrderStatus from './middleware/get-order-status';
import fetchOrders from './middleware/fetch-orders';
import changeOrderView from './middleware/change-order-view';
import loading from './middleware/loading';
import signIn from './middleware/sign-in';
import logout from './middleware/logout';

import Loading from '../misc/Loading';
import TogAlert from '../misc/TogAlert';
import ErrorHandler from '../misc/ErrorHandler';
import SignIn from '../SignIn/SignIn';
import Landing from '../Landing/Landing';
import Settings from '../Settings';
import NotFound from '../NotFound';

import '../../css/components/App.css';

import defaultState from '../../default.json';

class App extends Component {
  constructor(props) {
    super(props);
    this.request = request.bind(this);
    this.setStateVal = setStateVal.bind(this);
    this.showOtherForm = showOtherForm.bind(this);
    this.submit = submit.bind(this);
    this.getOrderStatus = getOrderStatus.bind(this);
    this.dismissTog = dismissTog.bind(this);
    this.toggleMessage = toggleMessage.bind(this);
    this.fetchOrders = fetchOrders.bind(this);
    this.changeOrderView = changeOrderView.bind(this);
    this.loading = loading.call(this);
    this.signIn = signIn.bind(this);
    this.logout = logout.bind(this);
    this.noop = () => {};
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

  render() {
    const {
      admin,
      logErrs,
      errMsg,
      defErrMsg,
      togMsg,
      togStat,
      orders,
      apiUrl,
      user,
      showStockOrderForm
    } = this.state;
    return (
      <div className="App">
        <Loading loading={this.state.loading} />
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
                              () =>
                                <Landing
                                  apiUrl={apiUrl}
                                  fetchOrders={this.fetchOrders}
                                  logout={this.logout}
                                  admin={admin}
                                  orders={orders}
                                  viewBy={this.state.viewBy}
                                  toggleMessage={this.toggleMessage}
                                  changeOrderView={this.changeOrderView}
                                  setStateVal={this.setStateVal}
                                  statusTypes={this.state.statusTypes}
                                  showOtherForm={this.showOtherForm}
                                  showStockOrderForm={showStockOrderForm}
                                />
                            }
                          />
                          <Match
                            exactly
                            pattern="/settings"
                            render={() => <Settings return="/" />}
                          />
                        </div>
                      :
                        <Match
                          exactly
                          pattern="/"
                          render={() => <SignIn signIn={this.signIn} />}
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
