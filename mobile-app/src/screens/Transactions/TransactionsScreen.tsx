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

export default function TransactionsScreen({navigation}: any) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const data = await transactionService.getAll();
      setTransactions(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load transactions');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const renderTransaction = ({item}: {item: Transaction}) => {
    const isIncome = item.type === 'income';
    const isExpense = item.type === 'expense';
    const isTransfer = item.type === 'transfer';

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
            {isIncome ? '+' : isExpense ? '-' : ''}${item.amount.toFixed(2)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Transactions</Text>
      </View>

      <FlatList
        data={transactions}
        renderItem={renderTransaction}
        keyExtractor={item => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={loadTransactions} />
        }
        contentContainerStyle={styles.list}
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
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  list: {
    padding: 20,
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

