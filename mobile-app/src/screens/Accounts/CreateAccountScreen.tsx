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
  Picker,
} from 'react-native';
import {accountService, CreateAccountData} from '../../services/accountService';
import {accountGroupService} from '../../services/accountGroupService';

export default function CreateAccountScreen({navigation}: any) {
  const [name, setName] = useState('');
  const [type, setType] = useState('checking');
  const [balance, setBalance] = useState('');
  const [color, setColor] = useState('#3b82f6');
  const [groupId, setGroupId] = useState<string>('');
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadGroups();
  }, []);

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
      const data: CreateAccountData = {
        name,
        type,
        balance: balance ? parseFloat(balance) : 0,
        color,
        group_id: groupId ? parseInt(groupId) : null,
      };
      await accountService.create(data);
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

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
        <Text style={styles.title}>Create Account</Text>
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
        <View style={styles.pickerContainer}>
          <Picker selectedValue={type} onValueChange={setType}>
            <Picker.Item label="Checking" value="checking" />
            <Picker.Item label="Savings" value="savings" />
            <Picker.Item label="Cash" value="cash" />
            <Picker.Item label="Credit Card" value="credit" />
            <Picker.Item label="Investment" value="investment" />
            <Picker.Item label="Other" value="other" />
          </Picker>
        </View>

        <Text style={styles.label}>Initial Balance</Text>
        <TextInput
          style={styles.input}
          value={balance}
          onChangeText={setBalance}
          placeholder="0.00"
          keyboardType="decimal-pad"
        />

        <Text style={styles.label}>Group</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={groupId} onValueChange={setGroupId}>
            <Picker.Item label="No Group" value="" />
            {groups.map(group => (
              <Picker.Item key={group.id} label={group.name} value={group.id.toString()} />
            ))}
          </Picker>
        </View>

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
            <Text style={styles.buttonText}>Create Account</Text>
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
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
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

