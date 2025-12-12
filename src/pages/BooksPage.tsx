import React, { useState } from 'react';
import BookList from '../components/Book/BookList';
import BookForm from '../components/Book/BookForm';
import { bookService } from '../services/bookService';
import { Book, CreateBookDto, UpdateBookDto } from '../types/book.types';
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
  Book as BookIcon,
  Home as HomeIcon,
  MenuBook as MenuBookIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const BooksPage: React.FC = () => {
  const [formOpen, setFormOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const handleAdd = () => {
    setSelectedBook(null);
    setFormOpen(true);
  };

  const handleEdit = (book: Book) => {
    setSelectedBook(book);
    setFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar este libro? Esta acción no se puede deshacer.')) {
      try {
        await bookService.deleteBook(id);
        showMessage('Libro eliminado exitosamente', 'success');
      } catch (error: any) {
        showMessage(error.message || 'Error al eliminar el libro', 'error');
      }
    }
  };

  const handleSubmit = async (bookData: CreateBookDto | UpdateBookDto) => {
    try {
      if (selectedBook) {
        await bookService.updateBook(selectedBook.id, bookData as UpdateBookDto);
        showMessage('Libro actualizado exitosamente', 'success');
      } else {
        await bookService.createBook(bookData as CreateBookDto);
        showMessage('Libro creado exitosamente', 'success');
      }
      setFormOpen(false);
    } catch (error: any) {
      showMessage(error.message || 'Error al guardar el libro', 'error');
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
            <MenuBookIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Libros
          </Typography>
        </Breadcrumbs>
      </Box>

      <Box display="flex" alignItems="center" marginBottom={4}>
        <BookIcon sx={{ fontSize: 48, marginRight: 2, color: 'primary.main' }} />
        <Box>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Gestión de Libros
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Administra el catálogo de libros de la biblioteca
          </Typography>
        </Box>
      </Box>

      <BookList
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <BookForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        initialData={selectedBook}
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

export default BooksPage;