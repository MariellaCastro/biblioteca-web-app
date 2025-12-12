import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Button,
  Paper,
  Avatar,
  Stack,
} from '@mui/material';
import { 
  MenuBook, 
  History,
  School,
  ArrowForward,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const quickActions = [
    { title: 'Gestionar Libros', description: 'Agregar, editar o eliminar libros', path: '/books', icon: <MenuBook /> },
    { title: 'Ver Préstamos', description: 'Consultar préstamos activos y devueltos', path: '/loans', icon: <History /> },
    { title: 'Registrar Préstamo', description: 'Crear nuevo préstamo de libro', path: '/loans?action=new', icon: <School /> },
  ];

  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Paper
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)',
          color: 'white',
          borderRadius: 3,
          p: 5,
          mb: 5,
          mt: 3,
        }}
      >
        <Box display="flex" alignItems="center" mb={3}>
          <Avatar sx={{ bgcolor: 'white', color: '#1976d2', width: 60, height: 60, mr: 3 }}>
            <MenuBook fontSize="large" />
          </Avatar>
          <Box>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              Sistema de Biblioteca Universitaria
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              Gestión integral de libros y préstamos
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Quick Actions */}
      <Typography variant="h5" fontWeight="bold" gutterBottom mb={3}>
        Acciones Rápidas
      </Typography>
      <Box 
        sx={{ 
          display: 'grid', 
          gridTemplateColumns: { 
            xs: '1fr', 
            md: 'repeat(3, 1fr)' 
          }, 
          gap: 3, 
          mb: 5 
        }}
      >
        {quickActions.map((action, index) => (
          <Box key={index}>
            <Card 
              elevation={2} 
              sx={{ 
                borderRadius: 3,
                height: '100%',
                transition: 'transform 0.2s',
                '&:hover': { 
                  transform: 'translateY(-4px)',
                  boxShadow: 6
                }
              }}
            >
              <CardContent>
                <Stack spacing={2}>
                  <Box display="flex" alignItems="center">
                    <Avatar sx={{ bgcolor: '#1976d2', mr: 2 }}>
                      {action.icon}
                    </Avatar>
                    <Typography variant="h6" fontWeight="bold">
                      {action.title}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    {action.description}
                  </Typography>
                  <Box>
                    <Button
                      component={Link}
                      to={action.path}
                      variant="contained"
                      endIcon={<ArrowForward />}
                      fullWidth
                    >
                      Acceder
                    </Button>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
    </Container>
  );
};

export default Home;