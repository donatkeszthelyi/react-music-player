import React from 'react';
import ReactDOM from 'react-dom/client'; // for React 18+
import './index.css';
import App from './App'; // Import your main App component

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App /> {/* This renders the App component */}
  </React.StrictMode>
);
