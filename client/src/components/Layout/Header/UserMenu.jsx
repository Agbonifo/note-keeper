// client/src/components/Layout/header/UserMenu.jsx

import { useState } from "react";
import { IconButton, Menu, MenuItem, Avatar } from "@mui/material";
import useAuth from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function UserMenu() {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDashboard = () => {
    navigate("/dashboard");
    handleClose();
  };

  const handleProfile = () => {
    navigate("/profile");
    handleClose();
  };


  const handleChangePassword = () => {
    navigate("/change-password");
    handleClose();
  };

  const handleLogout = () => {
    logout();
    handleClose();
  };


  return (
    <div>
      <IconButton
        size="large"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
      >
        <Avatar
          sx={{
            bgcolor: "#fff",
            color: "primary.main",
          }}
        >
          {user?.username?.charAt(0).toUpperCase() ?? "U"}
        </Avatar>
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleDashboard}>Dashboard</MenuItem>
        <MenuItem onClick={handleProfile}>My Account</MenuItem>
        <MenuItem onClick={handleChangePassword}>Change password</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </div>
  );
}
