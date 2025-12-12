import React, { useState } from 'react';
import LoanList from '../components/Loan/LoanList';
import LoanForm from '../components/Loan/LoanForm';
import { loanService } from '../services/loanService';
import { CreateLoanDto } from '../types/loan.types';
import { 
  Alert, 
  Snackbar, 
  Container, 
  Typography, 
  Box,
  Breadcrumbs,
  Link as MuiLink,
} from '@mui/material';
import { 
  History as HistoryIcon,
  Home as HomeIcon,
  HistoryToggleOff,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const LoansPage: React.FC = () => {
  const [formOpen, setFormOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const handleAdd = () => {
    setFormOpen(true);
  };

  const handleReturn = async (id: number) => {
    if (window.confirm('¿Marcar este préstamo como devuelto?')) {
      try {
        await loanService.returnLoan(id);
        showMessage('Préstamo marcado como devuelto', 'success');
      } catch (error: any) {
        showMessage(error.message || 'Error al devolver el préstamo', 'error');
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar este registro de préstamo?')) {
      try {
        await loanService.deleteLoan(id);
        showMessage('Préstamo eliminado exitosamente', 'success');
      } catch (error: any) {
        showMessage(error.message || 'Error al eliminar el préstamo', 'error');
      }
    }
  };

  const handleSubmit = async (loanData: CreateLoanDto) => {
    try {
      await loanService.createLoan(loanData);
      showMessage('Préstamo creado exitosamente', 'success');
      setFormOpen(false);
    } catch (error: any) {
      if (error.message?.includes('stock') || error.message?.includes('disponible')) {
        showMessage('Error: El libro no tiene stock disponible', 'error');
      } else {
        showMessage(error.message || 'Error al crear el préstamo', 'error');
      }
      throw error;
    }
  };

  const showMessage = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="xl">
      <Box mb={3} mt={3}>
        <Breadcrumbs aria-label="breadcrumb">
          <MuiLink
            component={Link}
            to="/"
            color="inherit"
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Inicio
          </MuiLink>
          <Typography
            color="text.primary"
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <HistoryToggleOff sx={{ mr: 0.5 }} fontSize="inherit" />
            Préstamos
          </Typography>
        </Breadcrumbs>
      </Box>

      <Box display="flex" alignItems="center" marginBottom={4}>
        <HistoryIcon sx={{ fontSize: 48, marginRight: 2, color: 'primary.main' }} />
        <Box>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Gestión de Préstamos
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Control de préstamos y devoluciones de libros
          </Typography>
        </Box>
      </Box>

      <LoanList
        onAdd={handleAdd}
        onReturn={handleReturn}
        onDelete={handleDelete}
      />

      <LoanForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          elevation={6}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default LoansPage;