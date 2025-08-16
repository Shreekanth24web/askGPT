import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Markdown Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div style={{ color: "red" }}>⚠️ Something went wrong rendering this content.</div>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
