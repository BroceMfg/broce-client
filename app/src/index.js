import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Match, Miss } from 'react-router';
import App from './components/App';
import AdminApp from './components/AdminApp';
import NotFound from './components/NotFound';

const Root = () => {
  return (
    <BrowserRouter>
      <div>
        <Match exactly pattern="/" component={App} />
        <Match exactly pattern="/admin" component={AdminApp} />
        <Miss component={NotFound} />
      </div>
    </BrowserRouter>
  )
}

render(
  <Root />,
  document.getElementById('root')
);
