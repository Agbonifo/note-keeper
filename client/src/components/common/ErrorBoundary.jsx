import { Component } from "react";
import { Typography, Button } from "@mui/material";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center", 
          justifyContent: "center",
          height: "100vh"
        }}>
          <Typography variant="h4" gutterBottom>
            Something went wrong
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={this.handleReload}
          >
            Reload Page
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}