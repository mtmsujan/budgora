import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert} from 'react-native';
import {accountService, Account} from '../../services/accountService';

export default function AccountDetailScreen({route, navigation}: any) {
  const {accountId} = route.params;
  const [account, setAccount] = useState<Account | null>(null);

  useEffect(() => {
    loadAccount();
  }, []);

  const loadAccount = async () => {
    try {
      const data = await accountService.getById(accountId);
      setAccount(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load account');
    }
  };

  if (!account) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Account Details</Text>
        <TouchableOpacity onPress={() => navigation.navigate('EditAccount', {accountId})}>
          <Text style={styles.editButton}>Edit</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={[styles.iconContainer, {backgroundColor: account.color}]}>
          <Text style={styles.iconText}>{account.name.charAt(0).toUpperCase()}</Text>
        </View>

        <Text style={styles.accountName}>{account.name}</Text>
        <Text style={styles.accountType}>{account.type}</Text>

        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Balance</Text>
          <Text style={styles.balanceAmount}>${account.balance.toFixed(2)}</Text>
        </View>

        {account.group && (
          <View style={styles.groupContainer}>
            <Text style={styles.groupLabel}>Group</Text>
            <Text style={styles.groupName}>{account.group.name}</Text>
          </View>
        )}
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
  backButton: {
    fontSize: 16,
    color: '#6366f1',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  editButton: {
    fontSize: 16,
    color: '#6366f1',
  },
  content: {
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  iconText: {
    color: '#fff',
    fontSize: 40,
    fontWeight: 'bold',
  },
  accountName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  accountType: {
    fontSize: 16,
    color: '#64748b',
    textTransform: 'capitalize',
    marginBottom: 30,
  },
  balanceContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  groupContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: '100%',
  },
  groupLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  groupName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
});

