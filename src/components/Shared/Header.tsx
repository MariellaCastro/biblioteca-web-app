import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Home as HomeIcon,
  MenuBook as MenuBookIcon,
  History as HistoryIcon,
} from '@mui/icons-material';

const Header: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <AppBar position="sticky" elevation={3}>
      <Toolbar>
        <Box display="flex" alignItems="center" sx={{ flexGrow: 1 }}>
          <MenuBookIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div">
            Biblioteca Universitaria
          </Typography>
        </Box>

        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
          <Button
            color="inherit"
            component={Link}
            to="/"
            startIcon={<HomeIcon />}
            sx={{
              backgroundColor: isActive('/') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
            }}
          >
            Inicio
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/books"
            startIcon={<MenuBookIcon />}
            sx={{
              backgroundColor: isActive('/books') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
            }}
          >
            Libros
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/loans"
            startIcon={<HistoryIcon />}
            sx={{
              backgroundColor: isActive('/loans') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
            }}
          >
            Préstamos
          </Button>
        </Box>

      </Toolbar>
    </AppBar>
  );
};

export default Header;