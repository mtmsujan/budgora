import apiClient from './apiClient';

export interface Setting {
  id: number;
  currency: string;
  date_format: string;
  time_format: string;
  first_day_of_week: string;
  notifications_enabled: boolean;
  language: string;
}

export interface UpdateSettingData {
  currency?: string;
  date_format?: string;
  time_format?: string;
  first_day_of_week?: string;
  notifications_enabled?: boolean;
  language?: string;
}

export const settingsService = {
  async get(): Promise<Setting> {
    const response = await apiClient.get('/settings');
    return response.data.data;
  },

  async update(data: UpdateSettingData): Promise<Setting> {
    const response = await apiClient.put('/settings', data);
    return response.data.data;
  },
};

