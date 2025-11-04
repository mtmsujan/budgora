# API Documentation for Budgora Mobile App

## Base URL
```
http://your-domain.com/api/v1
```

## Authentication

All API endpoints (except login and register) require authentication using Bearer tokens.

### Register
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "1|..."
}
```

### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "1|..."
}
```

### Get Current User
```http
GET /api/v1/auth/user
Authorization: Bearer {token}
```

### Logout
```http
POST /api/v1/auth/logout
Authorization: Bearer {token}
```

---

## Accounts

### List Accounts
```http
GET /api/v1/accounts
Authorization: Bearer {token}
```

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Checking Account",
      "type": "checking",
      "balance": 1000.00,
      "color": "#3b82f6",
      "group_id": 1,
      "group": {
        "id": 1,
        "name": "Personal",
        "color": "#6b7280"
      },
      "created_at": "2025-11-04T12:00:00.000000Z",
      "updated_at": "2025-11-04T12:00:00.000000Z"
    }
  ]
}
```

### Create Account
```http
POST /api/v1/accounts
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Savings Account",
  "type": "savings",
  "balance": 5000.00,
  "color": "#10b981",
  "group_id": 1
}
```

### Get Account
```http
GET /api/v1/accounts/{id}
Authorization: Bearer {token}
```

### Update Account
```http
PUT /api/v1/accounts/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Updated Account Name",
  "balance": 6000.00
}
```

### Delete Account
```http
DELETE /api/v1/accounts/{id}
Authorization: Bearer {token}
```

---

## Account Groups

### List Account Groups
```http
GET /api/v1/account-groups
Authorization: Bearer {token}
```

### Create Account Group
```http
POST /api/v1/account-groups
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Personal",
  "color": "#6b7280",
  "order": 0
}
```

### Update Account Group
```http
PUT /api/v1/account-groups/{id}
Authorization: Bearer {token}
```

### Delete Account Group
```http
DELETE /api/v1/account-groups/{id}
Authorization: Bearer {token}
```

---

## Categories

### List Categories
```http
GET /api/v1/categories
Authorization: Bearer {token}
```

### Create Category
```http
POST /api/v1/categories
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Food",
  "type": "expense",
  "color": "#ef4444",
  "icon": "🍔"
}
```

### Update Category
```http
PUT /api/v1/categories/{id}
Authorization: Bearer {token}
```

### Delete Category
```http
DELETE /api/v1/categories/{id}
Authorization: Bearer {token}
```

---

## Transactions

### Create Income
```http
POST /api/v1/transactions/income
Authorization: Bearer {token}
Content-Type: application/json

{
  "date": "2025-11-04T12:00:00Z",
  "amount": 1000.00,
  "category_id": 1,
  "account_id": 1,
  "note": "Salary",
  "description": "Monthly salary"
}
```

### Create Expense
```http
POST /api/v1/transactions/expense
Authorization: Bearer {token}
Content-Type: application/json

{
  "date": "2025-11-04T12:00:00Z",
  "amount": 50.00,
  "category_id": 2,
  "account_id": 1,
  "note": "Groceries",
  "description": "Weekly groceries"
}
```

### Create Transfer
```http
POST /api/v1/transactions/transfer
Authorization: Bearer {token}
Content-Type: application/json

{
  "date": "2025-11-04T12:00:00Z",
  "amount": 200.00,
  "from_account_id": 1,
  "to_account_id": 2,
  "note": "Savings transfer",
  "description": "Monthly savings"
}
```

### List Transactions
```http
GET /api/v1/transactions
Authorization: Bearer {token}
```

### Get Transaction
```http
GET /api/v1/transactions/{id}
Authorization: Bearer {token}
```

### Delete Transaction
```http
DELETE /api/v1/transactions/{id}
Authorization: Bearer {token}
```

---

## Dashboard

### Get Dashboard Data
```http
GET /api/v1/dashboard
Authorization: Bearer {token}
```

---

## Error Responses

All errors follow this format:

```json
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email field is required."],
    "password": ["The password must be at least 8 characters."]
  }
}
```

---

## React Native Setup

### 1. Install Required Packages
```bash
npm install axios @react-native-async-storage/async-storage
```

### 2. Create API Client
```typescript
// api/client.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://your-domain.com/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
```

### 3. Example Usage
```typescript
// api/auth.ts
import apiClient from './client';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const authService = {
  async login(email: string, password: string) {
    const response = await apiClient.post('/auth/login', { email, password });
    await AsyncStorage.setItem('auth_token', response.data.token);
    return response.data;
  },
  
  async register(name: string, email: string, password: string) {
    const response = await apiClient.post('/auth/register', {
      name,
      email,
      password,
      password_confirmation: password,
    });
    await AsyncStorage.setItem('auth_token', response.data.token);
    return response.data;
  },
  
  async logout() {
    await apiClient.post('/auth/logout');
    await AsyncStorage.removeItem('auth_token');
  },
  
  async getCurrentUser() {
    const response = await apiClient.get('/auth/user');
    return response.data.user;
  },
};
```

---

## CORS Configuration

Make sure to configure CORS in `config/cors.php` to allow requests from your mobile app:

```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_origins' => ['*'], // In production, specify your app's origin
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
```

---

## Next Steps

1. Implement remaining API controllers (AccountGroup, Category, Transaction, Dashboard)
2. Add API resource classes for all models
3. Set up API versioning
4. Add API rate limiting
5. Create API tests
6. Set up Swagger/OpenAPI documentation
7. Configure CORS for production

