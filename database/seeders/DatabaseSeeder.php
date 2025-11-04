<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Account;
use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create or update test user
        $user = User::updateOrCreate(
            ['email' => 'admin@mail.com'],
            [
                'name' => 'Test User',
                'password' => Hash::make('12345678'),
            ]
        );

        // Delete existing accounts and categories for this user (for fresh seed)
        Account::where('user_id', $user->id)->delete();
        Category::where('user_id', $user->id)->delete();

        // Create default accounts for the user
        Account::create([
            'user_id' => $user->id,
            'name' => 'Cash',
            'type' => 'cash',
            'balance' => 0,
            'color' => '#10b981',
        ]);

        Account::create([
            'user_id' => $user->id,
            'name' => 'Checking Account',
            'type' => 'checking',
            'balance' => 0,
            'color' => '#3b82f6',
        ]);

        Account::create([
            'user_id' => $user->id,
            'name' => 'Savings Account',
            'type' => 'savings',
            'balance' => 0,
            'color' => '#8b5cf6',
        ]);

        // Create default categories
        $incomeCategories = [
            ['name' => 'Salary', 'type' => 'income', 'color' => '#10b981', 'icon' => '💰'],
            ['name' => 'Freelance', 'type' => 'income', 'color' => '#3b82f6', 'icon' => '💼'],
            ['name' => 'Investment', 'type' => 'income', 'color' => '#8b5cf6', 'icon' => '📈'],
            ['name' => 'Gift', 'type' => 'income', 'color' => '#ec4899', 'icon' => '🎁'],
            ['name' => 'Other Income', 'type' => 'income', 'color' => '#6b7280', 'icon' => '📊'],
        ];

        $expenseCategories = [
            ['name' => 'Food & Dining', 'type' => 'expense', 'color' => '#ef4444', 'icon' => '🍔'],
            ['name' => 'Shopping', 'type' => 'expense', 'color' => '#f59e0b', 'icon' => '🛍️'],
            ['name' => 'Transportation', 'type' => 'expense', 'color' => '#3b82f6', 'icon' => '🚗'],
            ['name' => 'Bills & Utilities', 'type' => 'expense', 'color' => '#8b5cf6', 'icon' => '💡'],
            ['name' => 'Entertainment', 'type' => 'expense', 'color' => '#ec4899', 'icon' => '🎬'],
            ['name' => 'Health & Fitness', 'type' => 'expense', 'color' => '#10b981', 'icon' => '💊'],
            ['name' => 'Education', 'type' => 'expense', 'color' => '#6366f1', 'icon' => '📚'],
            ['name' => 'Other Expense', 'type' => 'expense', 'color' => '#6b7280', 'icon' => '📊'],
        ];

        foreach ($incomeCategories as $category) {
            Category::create([
                'user_id' => $user->id,
                ...$category,
            ]);
        }

        foreach ($expenseCategories as $category) {
            Category::create([
                'user_id' => $user->id,
                ...$category,
            ]);
        }
    }
}
