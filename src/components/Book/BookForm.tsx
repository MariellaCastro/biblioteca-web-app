import React, { useState, useEffect } from 'react';
import { Book, CreateBookDto, UpdateBookDto } from '../../types/book.types';
import {
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';

interface BookFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (bookData: CreateBookDto | UpdateBookDto) => Promise<void>;
  initialData?: Book | null;
}

const BookForm: React.FC<BookFormProps> = ({ 
  open, 
  onClose, 
  onSubmit, 
  initialData 
}) => {
  const [formData, setFormData] = useState<CreateBookDto>({
    title: '',
    author: '',
    isbn: '',
    stock: 1,
  });
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        author: initialData.author,
        isbn: initialData.isbn,
        stock: initialData.stock,
      });
    } else {
      setFormData({
        title: '',
        author: '',
        isbn: '',
        stock: 1,
      });
    }
    setFormError(null);
  }, [initialData, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'stock' ? parseInt(value) || 0 : value,
    }));
    setFormError(null);
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      setFormError('El título es requerido');
      return false;
    }
    if (!formData.author.trim()) {
      setFormError('El autor es requerido');
      return false;
    }
    if (!formData.isbn.trim()) {
      setFormError('El ISBN es requerido');
      return false;
    }
    if (formData.stock < 0) {
      setFormError('El stock no puede ser negativo');
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
    setFormError(null);
    
    try {
      await onSubmit(formData);
      onClose();
    } catch (error: any) {
      setFormError(error.message || 'Error al guardar el libro');
    } finally {
      setLoading(false);
    }
  };

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
        {initialData ? '✏️ Editar Libro' : '📚 Nuevo Libro'}
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 3 }}>
          {formError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {formError}
            </Alert>
          )}
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Título *"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              disabled={loading}
              variant="outlined"
              size="small"
            />
            
            <TextField
              fullWidth
              label="Autor *"
              name="author"
              value={formData.author}
              onChange={handleChange}
              required
              disabled={loading}
              variant="outlined"
              size="small"
            />
            
            <TextField
              fullWidth
              label="ISBN *"
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
              required
              disabled={loading}
              variant="outlined"
              size="small"
            />
            
            <TextField
              fullWidth
              label="Stock *"
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleChange}
              required
              disabled={loading}
              variant="outlined"
              size="small"
              inputProps={{ min: 0 }}
              helperText="Cantidad disponible"
            />
          </Box>
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
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Guardando...' : initialData ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default BookForm;