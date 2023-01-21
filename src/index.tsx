import React from 'react';
import {createRoot} from 'react-dom/client';
import {App} from './App/App';


import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const rootDiv = document.createElement('div');
rootDiv.setAttribute('class', 'root');
const reactRoot = createRoot(rootDiv);
reactRoot.render(<App />);
document.body.appendChild(rootDiv);
