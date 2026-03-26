import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', color: '#ffaaa5', background: '#2d0010', height: '100vh', boxSizing: 'border-box' }}>
          <h1>Component Crashed</h1>
          <details style={{ whiteSpace: 'pre-wrap', marginTop: '20px', fontSize: '14px', lineHeight: '1.5' }}>
            <summary style={{ cursor: 'pointer', fontSize: '18px', fontWeight: 'bold' }}>{this.state.error && this.state.error.toString()}</summary>
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }
    return this.props.children; 
  }
}
