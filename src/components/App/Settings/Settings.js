import React from 'react';
import { Link } from 'react-router';

const Settings = () => (
  <div className="Settings">
    <Link to="/">
      <button>Back</button>
    </Link>
    <span>Settings View</span>
  </div>
);

export default Settings;
