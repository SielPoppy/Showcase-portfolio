import React from "react";

interface CSSErrorBoundaryProps {
  children: React.ReactNode;
}

interface CSSErrorBoundaryState {
  hasError: boolean;
}

export class CSSErrorBoundary extends React.Component<CSSErrorBoundaryProps, CSSErrorBoundaryState> {
  constructor(props: CSSErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): CSSErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    if (error.message.includes('stylesheet') || error.message.includes('CSSScopeRule')) {
      console.warn('CSS compatibility issue detected:', error.message);
      // Don't actually set hasError to true for CSS issues, just log them
      this.setState({ hasError: false });
    }
  }

  componentDidMount() {
    // Handle CSS-related errors globally
    this.handleWindowError = (event: ErrorEvent) => {
      if (event.message?.includes('stylesheet') || event.message?.includes('CSSScopeRule')) {
        event.preventDefault();
        console.warn('CSS error suppressed:', event.message);
      }
    };

    window.addEventListener('error', this.handleWindowError);
  }

  componentWillUnmount() {
    if (this.handleWindowError) {
      window.removeEventListener('error', this.handleWindowError);
    }
  }

  private handleWindowError?: (event: ErrorEvent) => void;

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#f8f9fa', 
          border: '1px solid #dee2e6',
          borderRadius: '8px',
          margin: '20px',
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#495057', marginBottom: '10px' }}>Something went wrong</h2>
          <p style={{ color: '#6c757d' }}>Please refresh the page to try again.</p>
        </div>
      );
    }

    return this.props.children;
  }
}