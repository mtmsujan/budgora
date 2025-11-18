import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {dashboardService} from '../../services/dashboardService';
import {authService} from '../../services/authService';
import {settingsService} from '../../services/settingsService';
import {formatCurrency} from '../../utils/currency';

export default function DashboardScreen({navigation, onLogout}: any) {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currency, setCurrency] = useState('USD');
  const isInitialMount = useRef(true);

  const loadSettings = async () => {
    try {
      const settings = await settingsService.get();
      setCurrency(settings.currency || 'USD');
    } catch (error) {
      console.error('Failed to load settings:', error);
      // Use default currency if settings fail to load
    }
  };

  const loadDashboard = async (showLoading: boolean = false) => {
    if (showLoading) {
      setLoading(true);
    }
    try {
      const data = await dashboardService.getDashboard();
      setDashboardData(data);
    } catch (error: any) {
      console.error('Dashboard error:', error);
      console.error('Error response:', error.response?.data);
      const errorMessage = error.response?.data?.message 
        || error.message 
        || 'Failed to load dashboard data';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Load data when component mounts
  useEffect(() => {
    loadDashboard(true);
    loadSettings();
    isInitialMount.current = false;
  }, []);

  // Reload data when screen comes into focus (e.g., after adding a transaction)
  useFocusEffect(
    React.useCallback(() => {
      // Reload without showing loading state when coming back to screen
      if (!isInitialMount.current) {
        loadDashboard(false);
        loadSettings();
      }
    }, [])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadDashboard(false), loadSettings()]);
  };

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await authService.logout();
          // Call onLogout callback to update auth state in App.tsx
          if (onLogout) {
            onLogout();
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }>
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <Text style={styles.settingsText}>⚙️</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={[styles.statCard, {backgroundColor: '#10b981'}]}>
          <Text style={styles.statLabel}>Total Income</Text>
          <Text style={styles.statValue}>
            {formatCurrency(dashboardData?.total_income || 0, currency)}
          </Text>
        </View>

        <View style={[styles.statCard, {backgroundColor: '#ef4444'}]}>
          <Text style={styles.statLabel}>Total Expenses</Text>
          <Text style={styles.statValue}>
            {formatCurrency(dashboardData?.total_expenses || 0, currency)}
          </Text>
        </View>

        <View style={[styles.statCard, {backgroundColor: '#6366f1'}]}>
          <Text style={styles.statLabel}>Balance</Text>
          <Text style={styles.statValue}>
            {formatCurrency(dashboardData?.balance || 0, currency)}
          </Text>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('CreateIncome')}>
          <Text style={styles.actionButtonText}>Add Income</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, {backgroundColor: '#ef4444'}]}
          onPress={() => navigation.navigate('CreateExpense')}>
          <Text style={styles.actionButtonText}>Add Expense</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, {backgroundColor: '#8b5cf6'}]}
          onPress={() => navigation.navigate('CreateTransfer')}>
          <Text style={styles.actionButtonText}>Transfer</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Accounts')}>
          <Text style={styles.menuItemText}>Accounts</Text>
          <Text style={styles.menuItemArrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Categories')}>
          <Text style={styles.menuItemText}>Categories</Text>
          <Text style={styles.menuItemArrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Transactions')}>
          <Text style={styles.menuItemText}>Transactions</Text>
          <Text style={styles.menuItemArrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('AccountGroups')}>
          <Text style={styles.menuItemText}>Account Groups</Text>
          <Text style={styles.menuItemArrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Settings')}>
          <Text style={styles.menuItemText}>Settings</Text>
          <Text style={styles.menuItemArrow}>→</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  settingsText: {
    fontSize: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  logoutText: {
    color: '#ef4444',
    fontSize: 16,
  },
  statsContainer: {
    padding: 20,
    gap: 16,
  },
  statCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
  },
  statLabel: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
    marginBottom: 8,
  },
  statValue: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  actionsContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#10b981',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  menuContainer: {
    padding: 20,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
  },
  menuItemArrow: {
    fontSize: 18,
    color: '#64748b',
  },
});

