"use client";

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree
 */

import { Component, ReactNode } from "react";
import PMDDErrorMessage from "../pages/information/components/customErrorMessage/PMDDErrorMessage";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    // In production, you might want to log to an error reporting service
    // Example: logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Use custom fallback or default error message
      return this.props.fallback || <PMDDErrorMessage />;
    }

    return this.props.children;
  }
}
