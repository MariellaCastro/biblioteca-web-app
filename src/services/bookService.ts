import api from './api';
import { Book, CreateBookDto, UpdateBookDto } from '../types/book.types';

export const bookService = {
  getAllBooks: async (): Promise<Book[]> => {
    const response = await api.get('/books');
    return response.data;
  },

  getBookById: async (id: number): Promise<Book> => {
    const response = await api.get(`/books/${id}`);
    return response.data;
  },

  createBook: async (bookData: CreateBookDto): Promise<Book> => {
    const response = await api.post('/books', bookData);
    return response.data;
  },

  updateBook: async (id: number, bookData: UpdateBookDto): Promise<Book> => {
    const response = await api.put(`/books/${id}`, bookData);
    return response.data;
  },

  deleteBook: async (id: number): Promise<void> => {
    await api.delete(`/books/${id}`);
  },

  getAvailableBooks: async (): Promise<Book[]> => {
    const response = await api.get('/books/available');
    return response.data;
  },

  getBooksWithStock: async (): Promise<Book[]> => {
    const books = await bookService.getAllBooks();
    return books.filter(book => book.stock > 0);
  },
};