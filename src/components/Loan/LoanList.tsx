import React, { useEffect, useState } from 'react';
import { Loan } from '../../types/loan.types';
import { loanService } from '../../services/loanService';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Alert,
  Box,
  Chip,
  IconButton,
} from '@mui/material';
import { Add, Refresh, CheckCircle, Delete } from '@mui/icons-material';

interface LoanListProps {
  onAdd: () => void;
  onReturn: (id: number) => void;
  onDelete: (id: number) => void;
}

const LoanList: React.FC<LoanListProps> = ({ onAdd, onReturn, onDelete }) => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active'>('active');

  useEffect(() => {
    loadLoans();
  }, [filter]);

  const loadLoans = async () => {
    try {
      setLoading(true);
      const data = filter === 'active' 
        ? await loanService.getActiveLoans()
        : await loanService.getAllLoans();
      setLoans(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Error al cargar préstamos');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
        <Box ml={2}>Cargando préstamos...</Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert 
        severity="error" 
        action={
          <Button color="inherit" size="small" onClick={loadLoans}>
            Reintentar
          </Button>
        }
      >
        {error}
      </Alert>
    );
  }

  const activeLoans = loans.filter(loan => loan.status === 'ACTIVE');
  const returnedLoans = loans.filter(loan => loan.status === 'RETURNED');

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" gap={2}>
          <Button
            variant={filter === 'active' ? 'contained' : 'outlined'}
            onClick={() => setFilter('active')}
          >
            Activos ({activeLoans.length})
          </Button>
          <Button
            variant={filter === 'all' ? 'contained' : 'outlined'}
            onClick={() => setFilter('all')}
          >
            Todos ({loans.length})
          </Button>
        </Box>
        
        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={loadLoans}
          >
            Actualizar
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={onAdd}
          >
            Nuevo Préstamo
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell><strong>Libro</strong></TableCell>
              <TableCell><strong>Estudiante</strong></TableCell>
              <TableCell><strong>Fecha Préstamo</strong></TableCell>
              <TableCell><strong>Fecha Devolución</strong></TableCell>
              <TableCell><strong>Estado</strong></TableCell>
              <TableCell><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loans.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No hay préstamos registrados
                </TableCell>
              </TableRow>
            ) : (
              loans.map((loan) => (
                <TableRow 
                  key={loan.id}
                  hover
                  sx={{ 
                    '&:hover': { backgroundColor: '#f9f9f9' },
                    opacity: loan.status === 'RETURNED' ? 0.7 : 1
                  }}
                >
                  <TableCell>
                    <Box>
                      <strong>{loan.bookTitle}</strong>
                      <Box fontSize="0.8em" color="text.secondary">
                        ID: {loan.bookId}
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{loan.studentName}</TableCell>
                  <TableCell>{formatDate(loan.loanDate)}</TableCell>
                  <TableCell>
                    {loan.returnDate ? formatDate(loan.returnDate) : 'Pendiente'}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={loan.status === 'ACTIVE' ? 'ACTIVO' : 'DEVUELTO'}
                      color={loan.status === 'ACTIVE' ? 'warning' : 'success'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {loan.status === 'ACTIVE' && (
                      <IconButton 
                        color="success" 
                        onClick={() => onReturn(loan.id)}
                        title="Marcar como devuelto"
                        size="small"
                      >
                        <CheckCircle fontSize="small" />
                      </IconButton>
                    )}
                    <IconButton 
                      color="error" 
                      onClick={() => onDelete(loan.id)}
                      title="Eliminar"
                      size="small"
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {filter === 'all' && (
        <Box mt={2} display="flex" justifyContent="space-between">
          <Box>
            <Chip 
              label={`Activos: ${activeLoans.length}`}
              color="warning"
              variant="outlined"
              size="small"
            />
            <Chip 
              label={`Devueltos: ${returnedLoans.length}`}
              color="success"
              variant="outlined"
              size="small"
              sx={{ ml: 1 }}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default LoanList;