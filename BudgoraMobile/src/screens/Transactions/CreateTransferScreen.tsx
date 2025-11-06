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
import DateTimePicker from '@react-native-community/datetimepicker';
import {transactionService, CreateTransferData} from '../../services/transactionService';
import {accountService} from '../../services/accountService';
import {settingsService} from '../../services/settingsService';
import {formatCurrency} from '../../utils/currency';

export default function CreateTransferScreen({navigation}: any) {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [amount, setAmount] = useState('');
  const [fromAccountId, setFromAccountId] = useState('');
  const [toAccountId, setToAccountId] = useState('');
  const [note, setNote] = useState('');
  const [description, setDescription] = useState('');
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
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
      setAccounts(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load accounts');
    }
  };

  const handleSubmit = async () => {
    if (!amount || !fromAccountId || !toAccountId) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (fromAccountId === toAccountId) {
      Alert.alert('Error', 'From and To accounts must be different');
      return;
    }

    setLoading(true);
    try {
      const data: CreateTransferData = {
        date: date.toISOString(),
        amount: parseFloat(amount),
        from_account_id: parseInt(fromAccountId),
        to_account_id: parseInt(toAccountId),
        note: note || undefined,
        description: description || undefined,
      };
      await transactionService.createTransfer(data);
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to create transfer');
    } finally {
      setLoading(false);
    }
  };

  const toAccounts = accounts.filter(acc => acc.id.toString() !== fromAccountId);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Transfer Money</Text>
        <View style={{width: 60}} />
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Date and Time *</Text>
        <View style={styles.dateTimeContainer}>
          <TouchableOpacity
            style={[styles.input, styles.dateTimeInput]}
            onPress={() => setShowDatePicker(true)}>
            <Text>{date.toLocaleDateString()}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.input, styles.dateTimeInput]}
            onPress={() => setShowTimePicker(true)}>
            <Text>{date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</Text>
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                // Preserve time when changing date
                const newDate = new Date(selectedDate);
                newDate.setHours(date.getHours());
                newDate.setMinutes(date.getMinutes());
                setDate(newDate);
              }
            }}
          />
        )}

        {showTimePicker && (
          <DateTimePicker
            value={date}
            mode="time"
            display="default"
            onChange={(event, selectedDate) => {
              setShowTimePicker(false);
              if (selectedDate) {
                // Preserve date when changing time
                const newDate = new Date(date);
                newDate.setHours(selectedDate.getHours());
                newDate.setMinutes(selectedDate.getMinutes());
                setDate(newDate);
              }
            }}
          />
        )}

        <Text style={styles.label}>Amount *</Text>
        <TextInput
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
          placeholder="0.00"
          keyboardType="decimal-pad"
        />

        <Text style={styles.label}>From Account *</Text>
        <View style={styles.pickerContainer}>
          {accounts.map(acc => (
            <TouchableOpacity
              key={acc.id}
              style={[
                styles.accountOption,
                fromAccountId === acc.id.toString() && styles.accountOptionSelected,
              ]}
              onPress={() => setFromAccountId(acc.id.toString())}>
              <Text>{acc.name} ({formatCurrency(acc.balance, currency)})</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>To Account *</Text>
        <View style={styles.pickerContainer}>
          {toAccounts.map(acc => (
            <TouchableOpacity
              key={acc.id}
              style={[
                styles.accountOption,
                toAccountId === acc.id.toString() && styles.accountOptionSelected,
              ]}
              onPress={() => setToAccountId(acc.id.toString())}>
              <Text>{acc.name} ({formatCurrency(acc.balance, currency)})</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Note</Text>
        <TextInput
          style={styles.input}
          value={note}
          onChangeText={setNote}
          placeholder="Short note"
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Additional details"
          multiline
          numberOfLines={4}
        />

        <TouchableOpacity
          style={[styles.button, styles.transferButton, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Transfer Money</Text>
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
  dateTimeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  dateTimeInput: {
    flex: 1,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    gap: 8,
  },
  accountOption: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  accountOptionSelected: {
    borderColor: '#6366f1',
    backgroundColor: '#eef2ff',
  },
  button: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  transferButton: {
    backgroundColor: '#8b5cf6',
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

