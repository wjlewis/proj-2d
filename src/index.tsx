import React from 'react';
import ReactDOM from 'react-dom';
import World from './World';
import Projection from './Projection';
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <div className="container">
      <World />
      <Projection />
    </div>
  </React.StrictMode>,
  document.getElementById('root')
);
