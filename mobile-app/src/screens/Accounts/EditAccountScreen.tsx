import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {accountService, Account} from '../../services/accountService';
import {accountGroupService} from '../../services/accountGroupService';

export default function EditAccountScreen({route, navigation}: any) {
  const {accountId} = route.params;
  const [account, setAccount] = useState<Account | null>(null);
  const [name, setName] = useState('');
  const [type, setType] = useState('checking');
  const [balance, setBalance] = useState('');
  const [color, setColor] = useState('#3b82f6');
  const [groupId, setGroupId] = useState<string>('');
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAccount();
    loadGroups();
  }, []);

  const loadAccount = async () => {
    try {
      const data = await accountService.getById(accountId);
      setAccount(data);
      setName(data.name);
      setType(data.type);
      setBalance(data.balance.toString());
      setColor(data.color);
      setGroupId(data.group_id?.toString() || '');
    } catch (error) {
      Alert.alert('Error', 'Failed to load account');
    }
  };

  const loadGroups = async () => {
    try {
      const data = await accountGroupService.getAll();
      setGroups(data);
    } catch (error) {
      console.error('Failed to load groups');
    }
  };

  const handleSubmit = async () => {
    if (!name) {
      Alert.alert('Error', 'Please enter account name');
      return;
    }

    setLoading(true);
    try {
      await accountService.update(accountId, {
        name,
        type,
        balance: balance ? parseFloat(balance) : 0,
        color,
        group_id: groupId ? parseInt(groupId) : null,
      });
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to update account');
    } finally {
      setLoading(false);
    }
  };

  if (!account) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const colorOptions = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
    '#8b5cf6', '#ec4899', '#06b6d4', '#14b8a6',
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Edit Account</Text>
        <View style={{width: 60}} />
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Account Name *</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter account name"
        />

        <Text style={styles.label}>Account Type *</Text>
        <TextInput
          style={styles.input}
          value={type}
          editable={false}
        />

        <Text style={styles.label}>Balance</Text>
        <TextInput
          style={styles.input}
          value={balance}
          onChangeText={setBalance}
          placeholder="0.00"
          keyboardType="decimal-pad"
        />

        <Text style={styles.label}>Color</Text>
        <View style={styles.colorGrid}>
          {colorOptions.map(c => (
            <TouchableOpacity
              key={c}
              style={[
                styles.colorOption,
                {backgroundColor: c},
                color === c && styles.colorOptionSelected,
              ]}
              onPress={() => setColor(c)}
            />
          ))}
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Update Account</Text>
          )}
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
  backButton: {
    fontSize: 16,
    color: '#6366f1',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  colorOptionSelected: {
    borderColor: '#1e293b',
  },
  button: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

