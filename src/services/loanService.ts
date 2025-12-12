import api from './api';
import { Loan, CreateLoanDto } from '../types/loan.types';

export const loanService = {
  getAllLoans: async (): Promise<Loan[]> => {
    const response = await api.get('/loans');
    return response.data;
  },

  getActiveLoans: async (): Promise<Loan[]> => {
    const response = await api.get('/loans/active');
    return response.data;
  },

  createLoan: async (loanData: CreateLoanDto): Promise<Loan> => {
    const response = await api.post('/loans', loanData);
    return response.data;
  },

  returnLoan: async (id: number): Promise<Loan> => {
    const response = await api.patch(`/loans/${id}/return`);
    return response.data;
  },

  deleteLoan: async (id: number): Promise<void> => {
    await api.delete(`/loans/${id}`);
  },
};