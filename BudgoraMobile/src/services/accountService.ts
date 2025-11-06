import apiClient from './apiClient';

export interface Account {
  id: number;
  name: string;
  type: string;
  balance: number;
  color: string;
  group_id: number | null;
  group?: {
    id: number;
    name: string;
    color: string;
  };
}

export interface CreateAccountData {
  name: string;
  type: string;
  balance?: number;
  color?: string;
  group_id?: number | null;
}

export const accountService = {
  async getAll(): Promise<Account[]> {
    const response = await apiClient.get('/accounts');
    return response.data.data;
  },

  async getById(id: number): Promise<Account> {
    const response = await apiClient.get(`/accounts/${id}`);
    return response.data.data;
  },

  async create(data: CreateAccountData): Promise<Account> {
    const response = await apiClient.post('/accounts', data);
    return response.data.data;
  },

  async update(id: number, data: Partial<CreateAccountData>): Promise<Account> {
    const response = await apiClient.put(`/accounts/${id}`, data);
    return response.data.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/accounts/${id}`);
  },
};

