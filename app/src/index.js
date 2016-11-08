import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Match, Miss } from 'react-router';
import Protected from './components/Protected';
import App from './components/App';
import AdminApp from './components/AdminApp';
import NotFound from './components/NotFound';
import './index.css';

const ProtectedContainer = (props) => (
  <Protected admin={props.admin}>
    <AdminApp />
    <App />
  </Protected>
)

const Root = () => {
  return (
    <BrowserRouter>
      <div>
        <Match
          exactly
          pattern="/"
          component={ProtectedContainer} />
        <Match
          exactly
          pattern="/admin"
          component={() => ProtectedContainer({ admin: true })} />
        <Miss component={NotFound} />
      </div>
    </BrowserRouter>
  )
}

render(
  <Root />,
  document.getElementById('root')
);
