"use client";

import React from "react";
import NetworkError from "./NetworkError";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

class ApiErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <NetworkError onClickRetry={() => this.setState({ hasError: false })} />
      );
    }
    return this.props.children;
  }
}

export default ApiErrorBoundary;
