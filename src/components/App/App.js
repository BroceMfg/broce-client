import React, { Component, PropTypes } from 'react';
import { BrowserRouter, Match, Miss } from 'react-router';
import autoBind from 'react-autobind';

import dismissTog from './middleware/dismiss-tog';
import toggleMessage from './middleware/toggle-message';
import setStateVal from './middleware/set-state-val';
import loading from './middleware/loading';
import signIn from './middleware/sign-in';
import logout from './middleware/logout';
import togNotifMenu from './middleware/toggle-notifications';

import Loading from './misc/Loading';
import TogAlert from './misc/TogAlert';
import ErrorHandler from './misc/ErrorHandler';
import SignIn from './SignIn/SignIn';
import Dashboard from './Dashboard/Dashboard';
import Landing from './Landing/Landing';
import Settings from './Settings/Settings';
import Forgot from './misc/Forgot';
import NotFound from './misc/NotFound';

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
    this.togNotifMenu = togNotifMenu.bind(this);
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

  renderMain(showOrderDetail, showOrderDetailStatus) {
    const precondition = showOrderDetail !== undefined
      && typeof showOrderDetail === 'string';
    const showOD = precondition ? showOrderDetail : undefined;
    return (
      <div className="main-wrapper">
        <Dashboard
          admin={this.state.admin}
          logout={this.logout}
          showNotifMenu={this.state.showNotifMenu}
          togNotifMenu={this.togNotifMenu}
          notifs={this.state.notifs}
        />
        <Landing
          addresses={this.state.addresses}
          admin={this.state.admin}
          apiUrl={this.state.apiUrl}
          loading={this.loading}
          notifs={this.state.notifs}
          orders={this.state.orders}
          setStateVal={this.setStateVal}
          showStockOrderForm={this.state.showStockOrderForm}
          statesList={this.state.statesList}
          statusTypes={this.state.statusTypes}
          toggleMessage={this.toggleMessage}
          viewBy={this.state.viewBy}
          showOrderDetail={showOD}
          showOrderDetailStatus={showOrderDetailStatus || 'quote'}
        />
      </div>
    );
  }

  render() {
    const {
      currTogId,
      defErrMsg,
      errMsg,
      logErrs,
      togMsg,
      togStat,
      user
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
              if (user) {
                return (
                  <ErrorHandler
                    log={logErrs}
                    msg={errMsg}
                    defErrMsg={defErrMsg}
                  />
                );
              }
              return null;
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
                            render={this.renderMain}
                          />
                          <Match
                            exactly
                            pattern="/orders/:id/:status"
                            render={matchProps =>
                              this.renderMain(matchProps.params.id, matchProps.params.status)
                            }
                          />
                          <Match
                            exactly
                            pattern="/settings"
                            render={() => <Settings return="/" />}
                          />
                        </div>
                      :
                        <div>
                          <Match
                            exactly
                            pattern="/"
                            render={() => <SignIn signIn={this.signIn} />}
                          />
                          <Match
                            exactly
                            pattern="/forgot"
                            component={Forgot}
                          />
                        </div>
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
