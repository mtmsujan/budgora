import apiClient from './apiClient';

export interface Transaction {
  id: number;
  type: 'income' | 'expense' | 'transfer';
  date: string;
  amount: number;
  category_id?: number;
  account_id: number;
  to_account_id?: number;
  note?: string;
  description?: string;
}

export interface CreateIncomeData {
  date: string;
  amount: number;
  category_id: number;
  account_id: number;
  note?: string;
  description?: string;
}

export interface CreateExpenseData {
  date: string;
  amount: number;
  category_id: number;
  account_id: number;
  note?: string;
  description?: string;
}

export interface CreateTransferData {
  date: string;
  amount: number;
  from_account_id: number;
  to_account_id: number;
  note?: string;
  description?: string;
}

export const transactionService = {
  async getAll(): Promise<Transaction[]> {
    const response = await apiClient.get('/transactions');
    return response.data.data;
  },

  async getById(id: number): Promise<Transaction> {
    const response = await apiClient.get(`/transactions/${id}`);
    return response.data.data;
  },

  async createIncome(data: CreateIncomeData): Promise<Transaction> {
    const response = await apiClient.post('/transactions/income', data);
    return response.data.data;
  },

  async createExpense(data: CreateExpenseData): Promise<Transaction> {
    const response = await apiClient.post('/transactions/expense', data);
    return response.data.data;
  },

  async createTransfer(data: CreateTransferData): Promise<Transaction> {
    const response = await apiClient.post('/transactions/transfer', data);
    return response.data.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/transactions/${id}`);
  },
};

