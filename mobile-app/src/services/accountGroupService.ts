import apiClient from './apiClient';

export interface AccountGroup {
  id: number;
  name: string;
  color: string;
  order: number;
}

export interface CreateAccountGroupData {
  name: string;
  color: string;
  order?: number;
}

export const accountGroupService = {
  async getAll(): Promise<AccountGroup[]> {
    const response = await apiClient.get('/account-groups');
    return response.data.data;
  },

  async getById(id: number): Promise<AccountGroup> {
    const response = await apiClient.get(`/account-groups/${id}`);
    return response.data.data;
  },

  async create(data: CreateAccountGroupData): Promise<AccountGroup> {
    const response = await apiClient.post('/account-groups', data);
    return response.data.data;
  },

  async update(id: number, data: Partial<CreateAccountGroupData>): Promise<AccountGroup> {
    const response = await apiClient.put(`/account-groups/${id}`, data);
    return response.data.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/account-groups/${id}`);
  },
};

