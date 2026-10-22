import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Suppress known Firebase Auth internal popup assertion errors in sandboxed iframe previews
window.addEventListener('unhandledrejection', (event) => {
  const reason = event.reason;
  const msg = typeof reason === 'string' ? reason : reason?.message || '';
  if (msg.includes('INTERNAL ASSERTION FAILED') || msg.includes('Pending promise was never set')) {
    event.preventDefault();
  }
});

window.addEventListener('error', (event) => {
  const msg = event.message || '';
  if (msg.includes('INTERNAL ASSERTION FAILED') || msg.includes('Pending promise was never set')) {
    event.preventDefault();
  }
});

createRoot(document.getElementById('root')!).render(<App />);
