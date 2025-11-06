import React, {useState} from 'react';
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
import {Picker} from '@react-native-picker/picker';
import {categoryService, CreateCategoryData} from '../../services/categoryService';

export default function CreateCategoryScreen({navigation}: any) {
  const [name, setName] = useState('');
  const [type, setType] = useState('expense');
  const [color, setColor] = useState('#6b7280');
  const [icon, setIcon] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name) {
      Alert.alert('Error', 'Please enter category name');
      return;
    }

    setLoading(true);
    try {
      const data: CreateCategoryData = {
        name,
        type,
        color,
        icon: icon || undefined,
      };
      await categoryService.create(data);
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to create category');
    } finally {
      setLoading(false);
    }
  };

  const colorOptions = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
    '#8b5cf6', '#ec4899', '#06b6d4', '#14b8a6',
    '#f97316', '#84cc16', '#eab308', '#6366f1',
  ];

  const iconOptions = [
    '💰', '💵', '💶', '💷', '💳', '💎', '🏦', '📊', '📈', '💼',
    '🍔', '🍕', '☕', '🍔', '🛍️', '🛒', '🚗', '🚕', '✈️', '🚲',
    '💡', '⚡', '🏠', '📱', '🎬', '🎮', '💊', '🏥', '📚', '🎁',
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Create Category</Text>
        <View style={{width: 60}} />
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Category Name *</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter category name"
        />

        <Text style={styles.label}>Type *</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={type} onValueChange={setType}>
            <Picker.Item label="Expense" value="expense" />
            <Picker.Item label="Income" value="income" />
            <Picker.Item label="Both" value="both" />
          </Picker>
        </View>

        <Text style={styles.label}>Icon</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.iconScroll}>
          <TouchableOpacity
            style={[styles.iconOption, !icon && styles.iconOptionSelected]}
            onPress={() => setIcon('')}>
            <Text style={styles.iconText}>None</Text>
          </TouchableOpacity>
          {iconOptions.map(ic => (
            <TouchableOpacity
              key={ic}
              style={[
                styles.iconOption,
                icon === ic && styles.iconOptionSelected,
              ]}
              onPress={() => setIcon(ic)}>
              <Text style={styles.iconText}>{ic}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

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
            <Text style={styles.buttonText}>Create Category</Text>
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
  iconScroll: {
    marginTop: 8,
  },
  iconOption: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  iconOptionSelected: {
    borderColor: '#6366f1',
    backgroundColor: '#eef2ff',
  },
  iconText: {
    fontSize: 24,
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

