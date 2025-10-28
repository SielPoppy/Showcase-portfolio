import React from 'react';

interface State {
  hasError: boolean;
  error: Error | null;
  info: React.ErrorInfo | null;
}

export default class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, State> {
  // Explicitly declare instance `props` so `this.props` is recognized by TS
  // Use definite assignment because React provides the value.
  public props!: React.PropsWithChildren<{}>;

  // Re-introduce the instance `state` property so TS knows it exists.
  // Use definite assignment because we initialize it in the constructor.
  public state!: State;

  // Declare the setState type so any consumer or internal usage is typed correctly
  // without accidentally shadowing React.Component.setState implementation.
  // `declare` tells TypeScript this member exists and is provided by React.
  declare setState: React.Component<React.PropsWithChildren<{}>, State>["setState"];

  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error, info: null };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    
    // eslint-disable-next-line no-console
    console.error('Uncaught error in ErrorBoundary:', error, info);
    this.setState({ error, info });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-xl w-full bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
            <p className="text-sm text-gray-700 mb-4">An unexpected error occurred; check the console for details. You can still continue using parts of the site.</p>
            {this.state.error && (
              <details className="text-xs text-gray-600 whitespace-pre-wrap">
                <summary className="cursor-pointer text-sm text-purple-700">Error details</summary>
                {String(this.state.error)}
                {this.state.info ? '\n' + this.state.info.componentStack : null}
              </details>
            )}
            <div className="mt-4 flex gap-2">
              <button onClick={() => window.location.reload()} className="px-3 py-2 bg-purple-600 text-white rounded">Reload</button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children as React.ReactElement;
  }
}
