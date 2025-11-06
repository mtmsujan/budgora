import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StatusBar} from 'expo-status-bar';

// Screens
import LoginScreen from './src/screens/Auth/LoginScreen';
import RegisterScreen from './src/screens/Auth/RegisterScreen';
import DashboardScreen from './src/screens/Dashboard/DashboardScreen';
import AccountsScreen from './src/screens/Accounts/AccountsScreen';
import AccountDetailScreen from './src/screens/Accounts/AccountDetailScreen';
import CreateAccountScreen from './src/screens/Accounts/CreateAccountScreen';
import EditAccountScreen from './src/screens/Accounts/EditAccountScreen';
import CategoriesScreen from './src/screens/Categories/CategoriesScreen';
import CreateCategoryScreen from './src/screens/Categories/CreateCategoryScreen';
import EditCategoryScreen from './src/screens/Categories/EditCategoryScreen';
import TransactionsScreen from './src/screens/Transactions/TransactionsScreen';
import CreateIncomeScreen from './src/screens/Transactions/CreateIncomeScreen';
import CreateExpenseScreen from './src/screens/Transactions/CreateExpenseScreen';
import CreateTransferScreen from './src/screens/Transactions/CreateTransferScreen';
import AccountGroupsScreen from './src/screens/AccountGroups/AccountGroupsScreen';
import SettingsScreen from './src/screens/Settings/SettingsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      setIsAuthenticated(!!token);
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return null; // You can add a loading screen here
  }

  return (
    <>
      <StatusBar style="auto" />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          {!isAuthenticated ? (
            <>
              <Stack.Screen name="Login">
                {props => <LoginScreen {...props} onLogin={() => setIsAuthenticated(true)} />}
              </Stack.Screen>
              <Stack.Screen name="Register">
                {props => <RegisterScreen {...props} onRegister={() => setIsAuthenticated(true)} />}
              </Stack.Screen>
            </>
          ) : (
            <>
              <Stack.Screen name="Dashboard" component={DashboardScreen} />
              <Stack.Screen name="Accounts" component={AccountsScreen} />
              <Stack.Screen name="AccountDetail" component={AccountDetailScreen} />
              <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
              <Stack.Screen name="EditAccount" component={EditAccountScreen} />
              <Stack.Screen name="Categories" component={CategoriesScreen} />
              <Stack.Screen name="CreateCategory" component={CreateCategoryScreen} />
              <Stack.Screen name="EditCategory" component={EditCategoryScreen} />
              <Stack.Screen name="Transactions" component={TransactionsScreen} />
              <Stack.Screen name="CreateIncome" component={CreateIncomeScreen} />
              <Stack.Screen name="CreateExpense" component={CreateExpenseScreen} />
              <Stack.Screen name="CreateTransfer" component={CreateTransferScreen} />
              <Stack.Screen name="AccountGroups" component={AccountGroupsScreen} />
              <Stack.Screen name="Settings" component={SettingsScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
