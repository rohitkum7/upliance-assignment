import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const linkStyle = {
    textDecoration: "none",
    color: "inherit",
  };

  return (
    <AppBar position="sticky" color="primary" sx={{ mb: 3 }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Brand Name */}
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          🍲 Recipe App
        </Typography>

        {/* Navigation Links */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <NavLink
            to="/recipes"
            style={({ isActive }) => ({
              ...linkStyle,
              fontWeight: isActive ? "bold" : "normal",
              backgroundColor: isActive
                ? "rgba(255,255,255,0.2)"
                : "transparent",
              borderRadius: "8px",
              padding: "6px 12px",
            })}
          >
            <Button color="inherit">Home</Button>
          </NavLink>

          <NavLink
            to="/create"
            style={({ isActive }) => ({
              ...linkStyle,
              fontWeight: isActive ? "bold" : "normal",
              backgroundColor: isActive
                ? "rgba(255,255,255,0.2)"
                : "transparent",
              borderRadius: "8px",
              padding: "6px 12px",
            })}
          >
            <Button color="inherit">Create Recipe</Button>
          </NavLink>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
