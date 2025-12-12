import React, { useEffect, useState } from 'react';
import { Book } from '../../types/book.types';
import { bookService } from '../../services/bookService';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  CircularProgress,
  Alert,
  Box,
  Chip,
} from '@mui/material';
import { Edit, Delete, Add, Refresh } from '@mui/icons-material';

interface BookListProps {
  onEdit: (book: Book) => void;
  onDelete: (id: number) => void;
  onAdd: () => void;
}

const BookList: React.FC<BookListProps> = ({ onEdit, onDelete, onAdd }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const data = await bookService.getAllBooks();
      setBooks(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los libros');
    } finally {
      setLoading(false);
    }
  };

  const refreshList = () => {
    loadBooks();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
        <Box ml={2}>Cargando libros...</Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert 
        severity="error" 
        action={
          <Button color="inherit" size="small" onClick={refreshList}>
            Reintentar
          </Button>
        }
      >
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={onAdd}
        >
          Nuevo Libro
        </Button>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={refreshList}
        >
          Actualizar
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell><strong>Título</strong></TableCell>
              <TableCell><strong>Autor</strong></TableCell>
              <TableCell><strong>ISBN</strong></TableCell>
              <TableCell><strong>Stock</strong></TableCell>
              <TableCell><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {books.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No hay libros registrados
                </TableCell>
              </TableRow>
            ) : (
              books.map((book) => (
                <TableRow 
                  key={book.id}
                  hover
                  sx={{ '&:hover': { backgroundColor: '#f9f9f9' } }}
                >
                  <TableCell>{book.title}</TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell>{book.isbn}</TableCell>
                  <TableCell>
                    <Chip 
                      label={book.stock}
                      color={book.stock > 0 ? "success" : "error"}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton 
                      color="primary" 
                      onClick={() => onEdit(book)}
                      title="Editar"
                      size="small"
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton 
                      color="error" 
                      onClick={() => onDelete(book.id)}
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
    </Box>
  );
};

export default BookList;