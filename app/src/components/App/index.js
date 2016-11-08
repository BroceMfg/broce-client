import React from 'react';
import Dashboard from '../Dashboard';
import Landing from '../Landing';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Dashboard
          title="Broce Parts"
          buttonTitle="Settings"
          redirect="#"
        />
        <Landing>
          <span>
            HEY
          </span>
        </Landing>
      </div>
    );
  }
}

export default App;
