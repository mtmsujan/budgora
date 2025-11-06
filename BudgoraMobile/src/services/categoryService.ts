import apiClient from './apiClient';

export interface Category {
  id: number;
  name: string;
  type: string;
  color: string;
  icon?: string;
}

export interface CreateCategoryData {
  name: string;
  type: string;
  color: string;
  icon?: string;
}

export const categoryService = {
  async getAll(): Promise<Category[]> {
    const response = await apiClient.get('/categories');
    return response.data.data;
  },

  async getById(id: number): Promise<Category> {
    const response = await apiClient.get(`/categories/${id}`);
    return response.data.data;
  },

  async create(data: CreateCategoryData): Promise<Category> {
    const response = await apiClient.post('/categories', data);
    return response.data.data;
  },

  async update(id: number, data: Partial<CreateCategoryData>): Promise<Category> {
    const response = await apiClient.put(`/categories/${id}`, data);
    return response.data.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/categories/${id}`);
  },
};

