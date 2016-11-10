import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Match, Miss } from 'react-router';
import Protected from './components/Protected';
import App from './components/App';
import AdminApp from './components/AdminApp';
import './index.css';

// // --- PRODUCTION --- //
// // admin prop will be set on the server prior to render
// const Root = (props) => {
//   const admin = props.admin;
//   return Protected({ admin, AdminApp, App })
// }

// render(
//   <Root admin={valueFromServer}/>,
//   document.getElementById('root')
// );
// // --- END OF PROD --- //

// --- DEVELOPMENT --- //
const Root = () => {
  const NotFound = () => (
    <div className="NotFound">
      <span>Error 404: Page Not Found</span>
    </div>
  )
  return (
    <BrowserRouter>
      <div>
        <Match
          exactly
          pattern="/a*"
          component={() => Protected({
            admin: true,
            AdminApp,
            App
          })} />
        <Match
          exactly
          pattern="/b*"
          component={() => Protected({
            admin: false,
            AdminApp,
            App
          })} />
        <Miss component={NotFound} />
      </div>
    </BrowserRouter>
  )
}

render(
  <Root />,
  document.getElementById('root')
);
// --- END OF DEV --- //