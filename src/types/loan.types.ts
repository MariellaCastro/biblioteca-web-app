export interface Loan {
  id: number;
  bookId: number;
  bookTitle: string;
  studentName: string;
  loanDate: string;
  returnDate: string | null;
  status: 'ACTIVE' | 'RETURNED';
  createdAt: string;
  updatedAt: string;
}

export interface CreateLoanDto {
  bookId: number;
  studentName: string;
}

export interface ReturnLoanDto {
  returnDate: string;
}