import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Switch,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {settingsService, Setting, UpdateSettingData} from '../../services/settingsService';
import {CURRENCY_SYMBOLS} from '../../utils/currency';

export default function SettingsScreen({navigation}: any) {
  const [setting, setSetting] = useState<Setting | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [currency, setCurrency] = useState('USD');
  const [dateFormat, setDateFormat] = useState('Y-m-d');
  const [timeFormat, setTimeFormat] = useState('24');
  const [firstDayOfWeek, setFirstDayOfWeek] = useState('monday');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await settingsService.get();
      setSetting(data);
      setCurrency(data.currency);
      setDateFormat(data.date_format);
      setTimeFormat(data.time_format);
      setFirstDayOfWeek(data.first_day_of_week);
      setNotificationsEnabled(data.notifications_enabled);
      setLanguage(data.language);
    } catch (error: any) {
      console.error('Failed to load settings:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const data: UpdateSettingData = {
        currency,
        date_format: dateFormat,
        time_format: timeFormat,
        first_day_of_week: firstDayOfWeek,
        notifications_enabled: notificationsEnabled,
        language,
      };
      await settingsService.update(data);
      Alert.alert('Success', 'Settings saved successfully!');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366f1" />
          <Text style={styles.loadingText}>Loading settings...</Text>
        </View>
      </View>
    );
  }

  const currencies = [
    {code: 'USD', symbol: CURRENCY_SYMBOLS['USD'], name: 'US Dollar'},
    {code: 'EUR', symbol: CURRENCY_SYMBOLS['EUR'], name: 'Euro'},
    {code: 'GBP', symbol: CURRENCY_SYMBOLS['GBP'], name: 'British Pound'},
    {code: 'JPY', symbol: CURRENCY_SYMBOLS['JPY'], name: 'Japanese Yen'},
    {code: 'AUD', symbol: CURRENCY_SYMBOLS['AUD'], name: 'Australian Dollar'},
    {code: 'CAD', symbol: CURRENCY_SYMBOLS['CAD'], name: 'Canadian Dollar'},
    {code: 'CHF', symbol: CURRENCY_SYMBOLS['CHF'], name: 'Swiss Franc'},
    {code: 'CNY', symbol: CURRENCY_SYMBOLS['CNY'], name: 'Chinese Yuan'},
    {code: 'INR', symbol: CURRENCY_SYMBOLS['INR'], name: 'Indian Rupee'},
    {code: 'BRL', symbol: CURRENCY_SYMBOLS['BRL'], name: 'Brazilian Real'},
    {code: 'ZAR', symbol: CURRENCY_SYMBOLS['ZAR'], name: 'South African Rand'},
    {code: 'MXN', symbol: CURRENCY_SYMBOLS['MXN'], name: 'Mexican Peso'},
    {code: 'SGD', symbol: CURRENCY_SYMBOLS['SGD'], name: 'Singapore Dollar'},
    {code: 'HKD', symbol: CURRENCY_SYMBOLS['HKD'], name: 'Hong Kong Dollar'},
    {code: 'NZD', symbol: CURRENCY_SYMBOLS['NZD'], name: 'New Zealand Dollar'},
    {code: 'BDT', symbol: CURRENCY_SYMBOLS['BDT'], name: 'Bangladeshi Taka'},
    {code: 'PKR', symbol: CURRENCY_SYMBOLS['PKR'], name: 'Pakistani Rupee'},
    {code: 'LKR', symbol: CURRENCY_SYMBOLS['LKR'], name: 'Sri Lankan Rupee'},
    {code: 'NPR', symbol: CURRENCY_SYMBOLS['NPR'], name: 'Nepalese Rupee'},
    {code: 'THB', symbol: CURRENCY_SYMBOLS['THB'], name: 'Thai Baht'},
    {code: 'MYR', symbol: CURRENCY_SYMBOLS['MYR'], name: 'Malaysian Ringgit'},
    {code: 'IDR', symbol: CURRENCY_SYMBOLS['IDR'], name: 'Indonesian Rupiah'},
    {code: 'PHP', symbol: CURRENCY_SYMBOLS['PHP'], name: 'Philippine Peso'},
    {code: 'VND', symbol: CURRENCY_SYMBOLS['VND'], name: 'Vietnamese Dong'},
    {code: 'KRW', symbol: CURRENCY_SYMBOLS['KRW'], name: 'South Korean Won'},
    {code: 'TWD', symbol: CURRENCY_SYMBOLS['TWD'], name: 'Taiwan Dollar'},
    {code: 'AED', symbol: CURRENCY_SYMBOLS['AED'], name: 'UAE Dirham'},
    {code: 'SAR', symbol: CURRENCY_SYMBOLS['SAR'], name: 'Saudi Riyal'},
    {code: 'ILS', symbol: CURRENCY_SYMBOLS['ILS'], name: 'Israeli Shekel'},
    {code: 'TRY', symbol: CURRENCY_SYMBOLS['TRY'], name: 'Turkish Lira'},
    {code: 'RUB', symbol: CURRENCY_SYMBOLS['RUB'], name: 'Russian Ruble'},
    {code: 'PLN', symbol: CURRENCY_SYMBOLS['PLN'], name: 'Polish Zloty'},
    {code: 'SEK', symbol: CURRENCY_SYMBOLS['SEK'], name: 'Swedish Krona'},
    {code: 'NOK', symbol: CURRENCY_SYMBOLS['NOK'], name: 'Norwegian Krone'},
    {code: 'DKK', symbol: CURRENCY_SYMBOLS['DKK'], name: 'Danish Krone'},
    {code: 'CZK', symbol: CURRENCY_SYMBOLS['CZK'], name: 'Czech Koruna'},
    {code: 'HUF', symbol: CURRENCY_SYMBOLS['HUF'], name: 'Hungarian Forint'},
    {code: 'RON', symbol: CURRENCY_SYMBOLS['RON'], name: 'Romanian Leu'},
    {code: 'BGN', symbol: CURRENCY_SYMBOLS['BGN'], name: 'Bulgarian Lev'},
    {code: 'HRK', symbol: CURRENCY_SYMBOLS['HRK'], name: 'Croatian Kuna'},
    {code: 'EGP', symbol: CURRENCY_SYMBOLS['EGP'], name: 'Egyptian Pound'},
    {code: 'NGN', symbol: CURRENCY_SYMBOLS['NGN'], name: 'Nigerian Naira'},
    {code: 'KES', symbol: CURRENCY_SYMBOLS['KES'], name: 'Kenyan Shilling'},
    {code: 'ETB', symbol: CURRENCY_SYMBOLS['ETB'], name: 'Ethiopian Birr'},
    {code: 'GHS', symbol: CURRENCY_SYMBOLS['GHS'], name: 'Ghanaian Cedi'},
    {code: 'TZS', symbol: CURRENCY_SYMBOLS['TZS'], name: 'Tanzanian Shilling'},
    {code: 'UGX', symbol: CURRENCY_SYMBOLS['UGX'], name: 'Ugandan Shilling'},
    {code: 'MAD', symbol: CURRENCY_SYMBOLS['MAD'], name: 'Moroccan Dirham'},
    {code: 'TND', symbol: CURRENCY_SYMBOLS['TND'], name: 'Tunisian Dinar'},
    {code: 'DZD', symbol: CURRENCY_SYMBOLS['DZD'], name: 'Algerian Dinar'},
    {code: 'ARS', symbol: CURRENCY_SYMBOLS['ARS'], name: 'Argentine Peso'},
    {code: 'CLP', symbol: CURRENCY_SYMBOLS['CLP'], name: 'Chilean Peso'},
    {code: 'COP', symbol: CURRENCY_SYMBOLS['COP'], name: 'Colombian Peso'},
    {code: 'PEN', symbol: CURRENCY_SYMBOLS['PEN'], name: 'Peruvian Sol'},
    {code: 'UYU', symbol: CURRENCY_SYMBOLS['UYU'], name: 'Uruguayan Peso'},
  ].sort((a, b) => a.name.localeCompare(b.name));

  const dateFormats = [
    {value: 'Y-m-d', label: 'YYYY-MM-DD'},
    {value: 'm/d/Y', label: 'MM/DD/YYYY'},
    {value: 'd/m/Y', label: 'DD/MM/YYYY'},
    {value: 'd.m.Y', label: 'DD.MM.YYYY'},
    {value: 'M d, Y', label: 'Nov 06, 2024'},
  ];

  const languages = [
    {code: 'en', name: 'English'},
    {code: 'bn', name: 'Bangla (বাংলা)'},
    {code: 'es', name: 'Spanish (Español)'},
    {code: 'fr', name: 'French (Français)'},
    {code: 'de', name: 'German (Deutsch)'},
    {code: 'it', name: 'Italian (Italiano)'},
    {code: 'pt', name: 'Portuguese (Português)'},
    {code: 'zh', name: 'Chinese (中文)'},
    {code: 'ja', name: 'Japanese (日本語)'},
    {code: 'ko', name: 'Korean (한국어)'},
    {code: 'ar', name: 'Arabic (العربية)'},
    {code: 'hi', name: 'Hindi (हिन्दी)'},
    {code: 'ru', name: 'Russian (Русский)'},
    {code: 'tr', name: 'Turkish (Türkçe)'},
    {code: 'pl', name: 'Polish (Polski)'},
    {code: 'nl', name: 'Dutch (Nederlands)'},
    {code: 'sv', name: 'Swedish (Svenska)'},
    {code: 'no', name: 'Norwegian (Norsk)'},
    {code: 'da', name: 'Danish (Dansk)'},
    {code: 'fi', name: 'Finnish (Suomi)'},
    {code: 'th', name: 'Thai (ไทย)'},
    {code: 'vi', name: 'Vietnamese (Tiếng Việt)'},
    {code: 'id', name: 'Indonesian (Bahasa Indonesia)'},
    {code: 'ms', name: 'Malay (Bahasa Melayu)'},
    {code: 'ta', name: 'Tamil (தமிழ்)'},
    {code: 'te', name: 'Telugu (తెలుగు)'},
    {code: 'mr', name: 'Marathi (मराठी)'},
    {code: 'ur', name: 'Urdu (اردو)'},
    {code: 'fa', name: 'Persian (فارسی)'},
    {code: 'he', name: 'Hebrew (עברית)'},
  ].sort((a, b) => a.name.localeCompare(b.name));

  const daysOfWeek = [
    {value: 'monday', label: 'Monday'},
    {value: 'tuesday', label: 'Tuesday'},
    {value: 'wednesday', label: 'Wednesday'},
    {value: 'thursday', label: 'Thursday'},
    {value: 'friday', label: 'Friday'},
    {value: 'saturday', label: 'Saturday'},
    {value: 'sunday', label: 'Sunday'},
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
        <View style={{width: 60}} />
      </View>

      <View style={styles.form}>
        <Text style={styles.sectionTitle}>General</Text>

        <Text style={styles.label}>Currency *</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={currency} onValueChange={setCurrency}>
            {currencies.map(curr => (
              <Picker.Item
                key={curr.code}
                label={`${curr.symbol} ${curr.name} (${curr.code})`}
                value={curr.code}
              />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Date Format *</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={dateFormat} onValueChange={setDateFormat}>
            {dateFormats.map(format => (
              <Picker.Item key={format.value} label={format.label} value={format.value} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Time Format *</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={timeFormat} onValueChange={setTimeFormat}>
            <Picker.Item label="24-hour (14:30)" value="24" />
            <Picker.Item label="12-hour (2:30 PM)" value="12" />
          </Picker>
        </View>

        <Text style={styles.label}>First Day of Week *</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={firstDayOfWeek} onValueChange={setFirstDayOfWeek}>
            {daysOfWeek.map(day => (
              <Picker.Item key={day.value} label={day.label} value={day.value} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Language *</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={language} onValueChange={setLanguage}>
            {languages.map(lang => (
              <Picker.Item key={lang.code} label={lang.name} value={lang.code} />
            ))}
          </Picker>
        </View>

        <Text style={styles.sectionTitle}>Notifications</Text>

        <View style={styles.switchContainer}>
          <View style={styles.switchLabelContainer}>
            <Text style={styles.switchLabel}>Enable Notifications</Text>
            <Text style={styles.switchDescription}>
              Receive notifications for important updates
            </Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{false: '#cbd5e1', true: '#6366f1'}}
            thumbColor={notificationsEnabled ? '#fff' : '#f4f3f4'}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, saving && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={saving}>
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Save Settings</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#64748b',
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginTop: 24,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
    marginTop: 16,
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginTop: 16,
  },
  switchLabelContainer: {
    flex: 1,
    marginRight: 12,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  switchDescription: {
    fontSize: 14,
    color: '#64748b',
  },
  button: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 32,
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

