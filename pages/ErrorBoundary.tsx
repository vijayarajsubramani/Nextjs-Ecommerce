import React, { Component, ErrorInfo, ReactNode } from "react";
import Error from "../container/Error"

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
    public stepInput: React.RefObject<HTMLButtonElement>;
    public state: State = {
        hasError: false
    };
    constructor(props: any) {
        super(props);
        this.stepInput = React.createRef();
    }

    public static getDerivedStateFromError(_: Error): State {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <>
                    <Error errorType="Internal Error Get Support from Developer" refer={this.stepInput} />
                    <button type="button" onClick={() => this.setState({ hasError: false })} ref={this.stepInput} hidden>Go Back</button>
                </>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
