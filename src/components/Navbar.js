import React, { useState } from "react";
import {
  AppBar,
  Button,
  IconButton,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
} from "@mui/material";
import { CatchingPokemon, KeyboardArrowDown } from "@mui/icons-material";
import { Stack } from "@mui/system";
export const NavBar = () => {
  const [anchorE1, setEnchorE1] = useState(null);
  const open = Boolean(anchorE1);
  const handleClick = (event: React.MouseEvent) => {
    setEnchorE1(event.currentTarget);
  };
  const handleClose=()=>{
    setEnchorE1(null)
  }
  
  return (
    <AppBar position="fixed">
      <Toolbar>
        <IconButton size="large" edge="start" color="inherit" aria-label="logo">
          <CatchingPokemon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Face Recognition Application
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button color="inherit">Features</Button>
          <Button color="inherit">Pricing</Button>
          <Button color="inherit">About</Button>
          <Button
            id="resources-button"
            onClick={handleClick}
            color="inherit"
            aria-controls={open ? "resources-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            endIcon={<KeyboardArrowDown/>}
          >
            Resources
          </Button>
          <Button color="inherit">Login</Button>
        </Stack>
        <Menu
          id="resources-menu"
          anchorEl={anchorE1}
          open={open}
          onClose={handleClose}
          MenuListProps={{ "aria-labelledby": "resources-button" }}
          anchorPosition={{ top: 230, left: 630 }}
        //   anchorOrigin={{
        //     vertical:'center',
        //     horizontal:'left'
        //   }}
        //   transformOrigin={{
        //     vertical:'center',
        //     horizontal:'left'
        //   }}
        >
          <MenuItem onClick={handleClose}>Blog</MenuItem>
          <MenuItem onClick={handleClose}>Podcast</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};
