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
import {accountService, Account} from '../../services/accountService';
import {settingsService} from '../../services/settingsService';
import {formatCurrency} from '../../utils/currency';
import EmptyState from '../../components/EmptyState';

export default function AccountsScreen({navigation}: any) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currency, setCurrency] = useState('USD');

  useEffect(() => {
    loadAccounts();
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

  const loadAccounts = async () => {
    try {
      const data = await accountService.getAll();
      setAccounts(data || []);
    } catch (error: any) {
      console.error('Failed to load accounts:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to load accounts');
      setAccounts([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleDelete = (account: Account) => {
    Alert.alert(
      'Delete Account',
      `Are you sure you want to delete ${account.name}?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await accountService.delete(account.id);
              loadAccounts();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete account');
            }
          },
        },
      ],
    );
  };

  const renderAccount = ({item}: {item: Account}) => (
    <TouchableOpacity
      style={styles.accountCard}
      onPress={() => navigation.navigate('AccountDetail', {accountId: item.id})}>
      <View style={[styles.accountIcon, {backgroundColor: item.color}]}>
        <Text style={styles.accountIconText}>
          {item.name.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.accountInfo}>
        <Text style={styles.accountName}>{item.name}</Text>
        <Text style={styles.accountType}>{item.type}</Text>
        {item.group && (
          <Text style={styles.accountGroup}>{item.group.name}</Text>
        )}
      </View>
      <View style={styles.accountBalance}>
        <Text style={styles.balanceAmount}>{formatCurrency(item.balance, currency)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Accounts</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('CreateAccount')}>
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={accounts}
        renderItem={renderAccount}
        keyExtractor={item => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={loadAccounts} />
        }
        contentContainerStyle={[
          styles.list,
          accounts.length === 0 && styles.emptyList,
        ]}
        ListEmptyComponent={
          !loading ? (
            <EmptyState
              icon="💳"
              title="No Accounts Yet"
              message="Create your first account to start managing your finances!"
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
  addButton: {
    backgroundColor: '#6366f1',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  list: {
    padding: 20,
  },
  emptyList: {
    flexGrow: 1,
  },
  accountCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  accountIcon: {
    width: 50,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  accountIconText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  accountType: {
    fontSize: 14,
    color: '#64748b',
    textTransform: 'capitalize',
  },
  accountGroup: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
  },
  accountBalance: {
    alignItems: 'flex-end',
  },
  balanceAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
});

