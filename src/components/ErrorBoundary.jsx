import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  // static getDerivedStateFromError(error) {
  //   return { hasError: true };
  // }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-red-500">
          Team component failed to load. Please try again later.
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
