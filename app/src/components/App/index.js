import React from 'react';
import { BrowserRouter, Match, Miss } from 'react-router';
import Dashboard from '../Dashboard';
import Landing from '../Landing';
import OrderList from '../OrderList';
import Settings from '../Settings';
import NotFound from '../NotFound';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      orders: [
        {
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
        {
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
      ]
    }
  }

  render() {
    const orders = this.state.orders;

    const Main = (props) => (
      <div className="main-wrapper">
        <Dashboard
          title="Broce Parts"
          buttonTitle="Settings"
          redirect="/b/settings"
        />
        <Landing>
          <OrderList orders={props.orders}/>
        </Landing>
      </div>
    )

    return (
      <div className="App">
        <BrowserRouter>
          <div>
            <Match
              exactly
              pattern="/b"
              render={() => Main({ orders })} />
            <Match
              exactly
              pattern="/b/settings"
              render={() => <Settings return="/b" />} />
            <Miss component={NotFound} />
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
