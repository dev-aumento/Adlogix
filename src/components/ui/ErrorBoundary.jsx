import React from 'react';
import { ErrorPage } from '../../pages/ErrorPage';

/**
 * Catches render errors in the tree below and shows ErrorPage instead of a blank screen.
 * Does not catch event-handler or async errors — those need their own try/catch.
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    if (import.meta.env.DEV) {
      console.error('[ErrorBoundary]', error, info?.componentStack);
    } else {
      console.error('[ErrorBoundary]', error?.message || error);
    }
  }

  reset = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      return <ErrorPage error={this.state.error} onReset={this.reset} />;
    }
    return this.props.children;
  }
}
