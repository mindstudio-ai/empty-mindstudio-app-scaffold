// Importing the platform SDK auto-inits analytics (pageviews, presence) and
// window-level error reporting on startup. Keep this import even if you never
// call the SDK directly — without it, Vite tree-shakes the package out of the
// bundle and telemetry never starts.
import { telemetry } from '@mindstudio-ai/interface';

import { Component, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './global.css';

class ErrorBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <pre
          style={{
            padding: 24,
            color: '#ff5555',
            fontSize: 13,
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {this.state.error.message}
          {'\n'}
          {this.state.error.stack}
        </pre>
      );
    }
    return this.props.children;
  }
}

// The root hooks are what make crashes visible. React hands an error its
// boundaries caught to `onCaughtError`, which does nothing but log to the
// console — so the boundary below, left to itself, would hide every render
// crash from the platform. Both hooks report as UNHANDLED: this fallback is a
// stack trace, not a recovery. A boundary that renders something the user can
// carry on from should say so with `reactErrorHandler({ handled: true })`.
createRoot(document.getElementById('root')!, {
  onUncaughtError: telemetry.reactErrorHandler(),
  onCaughtError: telemetry.reactErrorHandler(),
}).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
);
