import React from 'react';
import Dashboard from '../Dashboard';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Dashboard
          title="Broce Parts"
          buttonTitle="Settings"
          redirect="#"
        />
      </div>
    );
  }
}

export default App;