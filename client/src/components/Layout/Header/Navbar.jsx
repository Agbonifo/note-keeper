// client/src/components/Layout/header/Navbar.jsx
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import UserMenu from "./UserMenu";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <AppBar position="static">
      <Toolbar>
        {user ? (
          <>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <Link
                to="/dashboard"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                Note Keeper
              </Link>
            </Typography>
            <UserMenu />
          </>
        ) : (
          <>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
                Note Keeper
              </Link>
            </Typography>
            <Button color="inherit" component={Link} to="/login">
              Sign in
            </Button>
            <Button color="inherit" component={Link} to="/create-account">
              Create account
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}