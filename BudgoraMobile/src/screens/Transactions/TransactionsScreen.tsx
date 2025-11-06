import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import {transactionService, Transaction} from '../../services/transactionService';
import {settingsService} from '../../services/settingsService';
import {formatCurrencyWithSign} from '../../utils/currency';
import EmptyState from '../../components/EmptyState';

export default function TransactionsScreen({navigation}: any) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currency, setCurrency] = useState('USD');

  useEffect(() => {
    loadTransactions();
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settings = await settingsService.get();
      setCurrency(settings.currency || 'USD');
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const loadTransactions = async () => {
    try {
      const data = await transactionService.getAll();
      setTransactions(data || []);
    } catch (error: any) {
      console.error('Failed to load transactions:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to load transactions');
      setTransactions([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const renderTransaction = ({item}: {item: Transaction}) => {
    const isIncome = item.type === 'income';
    const isExpense = item.type === 'expense';

    return (
      <View style={styles.transactionCard}>
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionType}>{item.type.toUpperCase()}</Text>
          <Text style={styles.transactionDate}>
            {new Date(item.date).toLocaleDateString()}
          </Text>
          {item.note && <Text style={styles.transactionNote}>{item.note}</Text>}
        </View>
        <View style={styles.transactionAmount}>
          <Text
            style={[
              styles.amountText,
              isIncome && styles.amountPositive,
              isExpense && styles.amountNegative,
            ]}>
            {formatCurrencyWithSign(item.amount, currency, isIncome ? '+' : isExpense ? '-' : '')}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Transactions</Text>
        <View style={{width: 60}} />
      </View>

      <FlatList
        data={transactions}
        renderItem={renderTransaction}
        keyExtractor={item => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={loadTransactions} />
        }
        contentContainerStyle={[
          styles.list,
          transactions.length === 0 && styles.emptyList,
        ]}
        ListEmptyComponent={
          !loading ? (
            <EmptyState
              icon="📊"
              title="No Transactions Yet"
              message="Start tracking your finances by adding your first income or expense transaction!"
            />
          ) : null
        }
      />
    </View>
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
  backButton: {
    marginRight: 12,
  },
  backButtonText: {
    fontSize: 16,
    color: '#6366f1',
    fontWeight: '500',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    flex: 1,
  },
  list: {
    padding: 20,
  },
  emptyList: {
    flexGrow: 1,
  },
  transactionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 4,
  },
  transactionNote: {
    fontSize: 14,
    color: '#1e293b',
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  amountPositive: {
    color: '#10b981',
  },
  amountNegative: {
    color: '#ef4444',
  },
});

