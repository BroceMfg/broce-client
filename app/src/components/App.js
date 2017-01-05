import React from 'react';
import { BrowserRouter, Match, Miss } from 'react-router';
import { post } from '../middleware/XMLHTTP';
import Landing from './Landing';
import Settings from './Settings';
import OrderDetail from './OrderDetail';
import NotFound from './NotFound';
import SignIn from './SignIn';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.setOrders = this.setOrders.bind(this);
    this.setUser = this.setUser.bind(this);
    this.logout = this.logout.bind(this);

    const retrievedObj = localStorage.getItem('state');
    let storedState = retrievedObj ? JSON.parse(retrievedObj) : undefined;
    if (storedState) storedState = { ...storedState, orders: {} }; // force reload orders

    this.state = storedState || {
      apiUrl: 'http://localhost:3001',
      orders: {},
      statusTypes: {
        0: 'unknown',
        1: 'quote',
        2: 'priced',
        3: 'ordered',
        4: 'shipped',
        5: 'archived',
        6: 'abandoned'
      },
      userRoleTypes: {
        0: 'client',
        1: 'admin'
      },
      user: undefined,
      admin: undefined
    }
  }

  componentWillUpdate(nextProps, nextState) {
    localStorage.setItem('state', JSON.stringify(nextState));
  }

  setOrders(orders) {
    this.setState({
      ...this.state,
      orders
    });
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

  render() {
    const {
      admin,
      orders,
      apiUrl,
      user
    } = this.state;

    return (
      <div className="App">
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
                              orders={orders}
                              apiUrl={apiUrl}
                              logout={this.logout}
                              setOrders={this.setOrders}
                              statusTypes={this.state.statusTypes}
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
                  render={ () => <SignIn apiUrl={apiUrl} setUser={this.setUser}/> }
                />
            }
            <Miss component={NotFound} />
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
