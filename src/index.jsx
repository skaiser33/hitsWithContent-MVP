import React from 'react';
import { render } from 'react-dom';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

// render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
