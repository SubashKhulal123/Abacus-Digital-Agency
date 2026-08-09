import { Component } from 'react';
import ServerError from '@pages/ServerError';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // In a real deployment this would report to an error tracking service
    // (Sentry, Bugsnag, etc.) — logging to console keeps this dependency-free.
    // eslint-disable-next-line no-console
    console.error('Uncaught render error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return <ServerError onRetry={this.handleReset} />;
    }
    return this.props.children;
  }
}
