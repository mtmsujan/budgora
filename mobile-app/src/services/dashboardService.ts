import apiClient from './apiClient';

export interface DashboardData {
  total_income: number;
  total_expenses: number;
  balance: number;
  recent_transactions: any[];
  accounts_summary: any[];
}

export const dashboardService = {
  async getDashboard(): Promise<DashboardData> {
    const response = await apiClient.get('/dashboard');
    return response.data.data;
  },
};

