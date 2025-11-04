# Budgora

Budgora helps you take control of your money — manage income, expenses, and insights with ease.

## Tech Stack

- **Backend**: Laravel 12
- **Frontend**: React 19 with TypeScript
- **Framework**: Inertia.js
- **Styling**: Tailwind CSS 4
- **Build Tool**: Vite

## Features

- ✅ Track income and expenses
- ✅ Beautiful, modern UI with gradients and animations
- ✅ User authentication
- ✅ Dashboard with financial overview
- ✅ Responsive design

## Setup Instructions

### Prerequisites

- PHP 8.2 or higher
- Composer
- Node.js 18+ and npm
- SQLite (or MySQL/PostgreSQL)

### Installation

1. **Install PHP dependencies:**
   ```bash
   composer install
   ```

2. **Install Node dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment:**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Configure database:**
   - Update `.env` with your database credentials
   - Or use SQLite (default): `touch database/database.sqlite`

5. **Run migrations:**
   ```bash
   php artisan migrate
   ```

6. **Build assets:**
   ```bash
   npm run build
   ```

### Development

**Start Laravel development server:**
```bash
php artisan serve
```

**Start Vite dev server (in another terminal):**
```bash
npm run dev
```

Visit `http://localhost:8000` in your browser.

## Project Structure

```
resources/
├── js/
│   ├── Components/      # Reusable React components
│   ├── Pages/           # Inertia page components
│   ├── types/           # TypeScript type definitions
│   └── app.tsx          # Application entry point
└── css/
    └── app.css          # Tailwind CSS styles
```

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
