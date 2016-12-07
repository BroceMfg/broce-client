import React from 'react';
import { BrowserRouter, Match, Miss } from 'react-router';
import Dashboard from '../Dashboard';
import Landing from '../Landing';
import OrderList from '../OrderList';
import OrderDetail from '../OrderDetail';
import QuoteForm from '../QuoteForm';
import Settings from '../Settings';
import NotFound from '../NotFound';
import SignIn from '../SignIn';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.orderOnClickHandler = this.orderOnClickHandler.bind(this);
    this.setToken = this.setToken.bind(this);

    this.state = {
      apiUrl: 'http://localhost:3001',
      orders: {
        1: {
          "id": 1,
          "shipping_address": "test address",
          "shipping_city": "test city",
          "shipping_state": "test sate",
          "shipping_zip": 11111,
          "po_number": "6789",
          "createdAt": "2000-12-16T17:21:13.000Z",
          "updatedAt": "2000-12-16T17:21:13.000Z",
          "UserId": 27,
          "Order_Details": [
            {
              "machine_serial_num": 77,
              "quantity": 1,
              "price": 18.99,
              "createdAt": "2000-12-16T17:21:13.000Z",
              "updatedAt": "2000-12-16T17:21:13.000Z",
              "Part": {
                "number": "FX-22-LS-3",
                "description": "descip",
                "cost": 20.99,
                "image_url": "http://google.com/images/photo",
                "createdAt": "2000-12-16T17:21:13.000Z",
                "updatedAt": "2000-12-16T17:21:13.000Z"
              }
            }
          ],
          "Order_Statuses": [
            {
              "current": true,
              "createdAt": "2000-12-16T17:21:13.000Z",
              "updatedAt": "2000-12-16T17:21:13.000Z",
              "StatusTypeId": 1
            }
          ]
        },
        36: {
          "id": 36,
          "shipping_address": "test_address",
          "shipping_city": "test_city",
          "shipping_state": "test_state",
          "shipping_zip": 11111,
          "po_number": "654",
          "createdAt": "2016-10-20T00:22:48.419Z",
          "updatedAt": "2016-10-20T00:22:48.419Z",
          "UserId": 1,
          "Order_Details": [],
          "Order_Statuses": []
        }
      }
    }
  }

  orderOnClickHandler(orderId) {
    this.context.router.transitionTo(`/b/orders/${orderId}`);
  }

  setToken(token) {
    this.setState({
      ...this.state,
      token
    });
  }

  render() {
    const {
      orders,
      apiUrl
    } = this.state;

    const Main = (props) => (
      <div className="main-wrapper">
        <Dashboard
          title="Broce Parts"
          buttonTitle="Settings"
          redirect="/b/settings"
        />
        <Landing>
          <OrderList
            orders={props.orders}
            orderOnClickHandler={this.orderOnClickHandler} />
          <QuoteForm />
        </Landing>
      </div>
    )

    return (
      <div className="App">
        <BrowserRouter>
          <div>
            {
              this.state.jwt 
                ? <Match
                    exactly
                    pattern="/b"
                    render={() => Main({ orders })}
                  />
                : <Match
                    exactly
                    pattern="/b"
                    render={() => <SignIn apiUrl={apiUrl} setToken={this.setToken}/>}
                  />
            }
            <Match
              exactly
              pattern="/b/settings"
              render={() => <Settings return="/b" />} />
            <Match
              exactly
              pattern="/b/orders/:id"
              render={
                (matchProps) => {
                  const order = orders[matchProps.params.id];
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
              } />
            <Miss component={NotFound} />
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

App.contextTypes = {
  router: React.PropTypes.object
}

export default App;
