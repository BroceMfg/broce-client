import React, { Component, PropTypes } from 'react';
import { BrowserRouter, Match, Miss } from 'react-router';
import autoBind from 'react-autobind';

import dismissTog from './middleware/dismiss-tog';
import toggleMessage from './middleware/toggle-message';
import setStateVal from './middleware/set-state-val';
import loading from './middleware/loading';
import signIn from './middleware/sign-in';
import logout from './middleware/logout';

import Loading from '../misc/Loading';
import TogAlert from '../misc/TogAlert';
import ErrorHandler from '../misc/ErrorHandler';
import SignIn from '../SignIn/SignIn';
import Dashboard from './Dashboard/Dashboard';
import Landing from './Landing/Landing';
import Settings from '../Settings';
import NotFound from '../NotFound';

import '../../css/components/App.css';

import defaultState from '../../default.json';

class App extends Component {
  constructor(props) {
    super(props);
    this.setStateVal = setStateVal.bind(this);
    this.dismissTog = dismissTog.bind(this);
    this.toggleMessage = toggleMessage.bind(this);
    this.loading = loading.call(this);
    this.signIn = signIn.bind(this);
    this.logout = logout.bind(this);
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
      currTogId,
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
            const togId = currTogId;
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
                                <div className="main-wrapper">
                                  <Dashboard logout={this.logout} />
                                  <Landing
                                    apiUrl={apiUrl}
                                    loading={this.loading}
                                    logout={this.logout}
                                    admin={admin}
                                    orders={orders}
                                    viewBy={this.state.viewBy}
                                    toggleMessage={this.toggleMessage}
                                    setStateVal={this.setStateVal}
                                    statusTypes={this.state.statusTypes}
                                    showStockOrderForm={showStockOrderForm}
                                  />
                                </div>
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

App.contextTypes = {
  router: PropTypes.object
};
