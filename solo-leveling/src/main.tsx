import { createRoot } from 'react-dom/client';
import App from './App.js';
import './index.css';
import './design-system.css';

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(<App />);
}
