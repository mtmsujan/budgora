import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import {dashboardService} from '../../services/dashboardService';
import {authService} from '../../services/authService';

export default function DashboardScreen({navigation}: any) {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const data = await dashboardService.getDashboard();
      setDashboardData(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await authService.logout();
          navigation.reset({
            index: 0,
            routes: [{name: 'Login'}],
          });
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
        <RefreshControl refreshing={refreshing} onRefresh={loadDashboard} />
      }>
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={[styles.statCard, {backgroundColor: '#10b981'}]}>
          <Text style={styles.statLabel}>Total Income</Text>
          <Text style={styles.statValue}>
            ${dashboardData?.total_income?.toFixed(2) || '0.00'}
          </Text>
        </View>

        <View style={[styles.statCard, {backgroundColor: '#ef4444'}]}>
          <Text style={styles.statLabel}>Total Expenses</Text>
          <Text style={styles.statValue}>
            ${dashboardData?.total_expenses?.toFixed(2) || '0.00'}
          </Text>
        </View>

        <View style={[styles.statCard, {backgroundColor: '#6366f1'}]}>
          <Text style={styles.statLabel}>Balance</Text>
          <Text style={styles.statValue}>
            ${dashboardData?.balance?.toFixed(2) || '0.00'}
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

