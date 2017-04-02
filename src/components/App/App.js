import React, { Component } from 'react';
import { BrowserRouter, Match, Miss } from 'react-router';
import autoBind from 'react-autobind';

import request from '../middleware/request';
import submit from '../middleware/submit';
import setStateVal from './middleware/set-state-val';
import getOrderStatus from './middleware/get-order-status';
import dismissTog from './middleware/dismissTog';
import toggleMessage from './middleware/toggleMessage';
import loading from './middleware/loading';
import logout from './middleware/logout';

import Loading from '../misc/Loading';
import TogAlert from '../misc/TogAlert';
import ErrorHandler from '../misc/ErrorHandler';
import SignIn from '../SignIn/SignIn';
import Landing from '../Landing/Landing';
import Settings from '../Settings';
import OrderDetail from '../OrderDetail';
import NotFound from '../NotFound';

import '../../css/components/App.css';

import defaultState from '../../default.json';

class App extends Component {
  constructor(props) {
    super(props);
    this.request = request.bind(this);
    this.setStateVal = setStateVal.bind(this);
    this.submit = submit.bind(this);
    this.getOStatus = getOrderStatus.bind(this);
    this.dismissTog = dismissTog.bind(this);
    this.toggleMessage = toggleMessage.bind(this);
    this.loading = loading.call(this);
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
                                      loading={this.loading}
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
                              loading={this.loading}
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
