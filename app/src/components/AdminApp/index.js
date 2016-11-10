import React from 'react';
import { BrowserRouter, Match, Miss } from 'react-router';
import NotFound from '../NotFound';

class AdminApp extends React.Component {
  render() {
    const Main = () => (
      <div className="Main">
        <span>Admin App</span>
      </div>
    )
    return (
      <div className="AdminApp">
        <BrowserRouter>
          <div>
            <Match exactly pattern="/a" render={Main} />
            <Miss component={NotFound} />
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default AdminApp;