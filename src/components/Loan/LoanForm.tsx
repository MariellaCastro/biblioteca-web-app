import React, { useState, useEffect } from 'react';
import { CreateLoanDto } from '../../types/loan.types';
import { Book } from '../../types/book.types';
import { bookService } from '../../services/bookService';
import {
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Box,
  Typography,
} from '@mui/material';

interface LoanFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (loanData: CreateLoanDto) => Promise<void>;
}

const LoanForm: React.FC<LoanFormProps> = ({ 
  open, 
  onClose, 
  onSubmit 
}) => {
  const [formData, setFormData] = useState<CreateLoanDto>({
    bookId: 0,
    studentName: '',
  });
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      loadAvailableBooks();
      setFormData({
        bookId: 0,
        studentName: '',
      });
      setFormError(null);
    }
  }, [open]);

  const loadAvailableBooks = async () => {
    try {
      setLoadingBooks(true);
      const availableBooks = await bookService.getAvailableBooks();
      setBooks(availableBooks);
    } catch (err: any) {
      setFormError('Error al cargar libros disponibles: ' + err.message);
    } finally {
      setLoadingBooks(false);
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'bookId' ? parseInt(value) || 0 : value,
    }));
    setFormError(null);
  };

  const validateForm = (): boolean => {
    if (!formData.bookId || formData.bookId === 0) {
      setFormError('Debe seleccionar un libro');
      return false;
    }
    if (!formData.studentName.trim()) {
      setFormError('El nombre del estudiante es requerido');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      await onSubmit(formData);
      onClose();
    } catch (error: any) {
      setFormError(error.message || 'Error al crear el préstamo');
    } finally {
      setLoading(false);
    }
  };

  const selectedBook = books.find(book => book.id === formData.bookId);

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ 
        backgroundColor: 'primary.main', 
        color: 'white',
        py: 2
      }}>
        📖 Nuevo Préstamo
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 3 }}>
          {formError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {formError}
            </Alert>
          )}
          
          <Box mb={3}>
            <FormControl fullWidth size="small" disabled={loadingBooks}>
              <InputLabel id="book-select-label">Libro *</InputLabel>
              <Select
                labelId="book-select-label"
                name="bookId"
                value={formData.bookId}
                label="Libro *"
                onChange={handleChange}
                required
              >
                <MenuItem value={0}>
                  <em>Seleccionar libro...</em>
                </MenuItem>
                {loadingBooks ? (
                  <MenuItem disabled>
                    <CircularProgress size={20} />
                    <Box ml={1}>Cargando libros...</Box>
                  </MenuItem>
                ) : books.length === 0 ? (
                  <MenuItem disabled>
                    No hay libros disponibles
                  </MenuItem>
                ) : (
                  books.map((book) => (
                    <MenuItem key={book.id} value={book.id}>
                      <Box>
                        <Typography variant="body2">
                          <strong>{book.title}</strong>
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {book.author} | Stock: {book.availableQuantity}/{book.totalQuantity}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
            
            {selectedBook && (
              <Alert severity="info" sx={{ mt: 2 }}>
                <strong>Información del libro seleccionado:</strong><br />
                Título: {selectedBook.title}<br />
                Autor: {selectedBook.author}<br />
                ISBN: {selectedBook.isbn}<br />
                Stock disponible: {selectedBook.availableQuantity}
              </Alert>
            )}
          </Box>
          
          <TextField
            fullWidth
            label="Nombre del Estudiante *"
            name="studentName"
            value={formData.studentName}
            onChange={handleChange}
            required
            disabled={loading}
            variant="outlined"
            size="small"
            placeholder="Ej: Juan Pérez"
            sx={{ mb: 2 }}
          />
          
          <Alert severity="warning">
            <strong>Importante:</strong> El estudiante debe devolver el libro en un plazo máximo de 15 días.
          </Alert>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={onClose} 
            disabled={loading}
            variant="outlined"
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            disabled={loading || loadingBooks || books.length === 0}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Creando...' : 'Crear Préstamo'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default LoanForm;