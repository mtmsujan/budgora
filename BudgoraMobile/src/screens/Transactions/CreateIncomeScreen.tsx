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
import {transactionService, CreateIncomeData} from '../../services/transactionService';
import {accountService} from '../../services/accountService';
import {categoryService} from '../../services/categoryService';
import {settingsService} from '../../services/settingsService';
import {formatCurrency} from '../../utils/currency';

export default function CreateIncomeScreen({navigation}: any) {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [accountId, setAccountId] = useState('');
  const [note, setNote] = useState('');
  const [description, setDescription] = useState('');
  const [accounts, setAccounts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currency, setCurrency] = useState('USD');

  useEffect(() => {
    loadData();
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

  const loadData = async () => {
    try {
      const [accountsData, categoriesData] = await Promise.all([
        accountService.getAll(),
        categoryService.getAll(),
      ]);
      setAccounts(accountsData || []);
      setCategories((categoriesData || []).filter(c => c.type === 'income' || c.type === 'both'));
    } catch (error: any) {
      console.error('Failed to load data:', error);
      console.error('Error response:', error.response?.data);
      const errorMessage = error.response?.data?.message 
        || error.message 
        || 'Failed to load data';
      Alert.alert('Error', errorMessage);
      // Set empty arrays to prevent map errors
      setAccounts([]);
      setCategories([]);
    }
  };

  const handleSubmit = async () => {
    if (!amount || !categoryId || !accountId) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const data: CreateIncomeData = {
        date: date.toISOString(),
        amount: parseFloat(amount),
        category_id: parseInt(categoryId),
        account_id: parseInt(accountId),
        note: note || undefined,
        description: description || undefined,
      };
      await transactionService.createIncome(data);
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to create income');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Add Income</Text>
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

        <Text style={styles.label}>Category *</Text>
        <View style={styles.pickerContainer}>
          {categories.map(cat => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryOption,
                categoryId === cat.id.toString() && styles.categoryOptionSelected,
              ]}
              onPress={() => setCategoryId(cat.id.toString())}>
              <Text>{cat.icon} {cat.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Account *</Text>
        <View style={styles.pickerContainer}>
          {accounts.map(acc => (
            <TouchableOpacity
              key={acc.id}
              style={[
                styles.accountOption,
                accountId === acc.id.toString() && styles.accountOptionSelected,
              ]}
              onPress={() => setAccountId(acc.id.toString())}>
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
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Add Income</Text>
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
  categoryOption: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  categoryOptionSelected: {
    borderColor: '#6366f1',
    backgroundColor: '#eef2ff',
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
    backgroundColor: '#10b981',
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

