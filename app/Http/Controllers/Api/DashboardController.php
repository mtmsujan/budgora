<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\Account;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        // Calculate total income (sum of all income transactions)
        $totalIncome = Transaction::where('user_id', $user->id)
            ->where('type', 'income')
            ->sum('amount');
        
        // Calculate total expenses (sum of all expense transactions)
        $totalExpenses = Transaction::where('user_id', $user->id)
            ->where('type', 'expense')
            ->sum('amount');
        
        // Calculate balance (income - expenses)
        $balance = $totalIncome - $totalExpenses;
        
        // Get recent transactions (last 10)
        $recentTransactions = Transaction::where('user_id', $user->id)
            ->with(['category', 'account'])
            ->orderBy('date', 'desc')
            ->limit(10)
            ->get();
        
        // Get accounts summary
        $accountsSummary = Account::where('user_id', $user->id)
            ->with('group')
            ->get()
            ->map(function ($account) {
                return [
                    'id' => $account->id,
                    'name' => $account->name,
                    'type' => $account->type,
                    'balance' => (float) $account->balance,
                    'color' => $account->color,
                    'group' => $account->group ? [
                        'id' => $account->group->id,
                        'name' => $account->group->name,
                    ] : null,
                ];
            });
        
        return response()->json([
            'data' => [
                'total_income' => (float) $totalIncome,
                'total_expenses' => (float) $totalExpenses,
                'balance' => (float) $balance,
                'recent_transactions' => $recentTransactions->map(function ($transaction) {
                    return [
                        'id' => $transaction->id,
                        'type' => $transaction->type,
                        'amount' => (float) $transaction->amount,
                        'date' => $transaction->date->toISOString(),
                        'category' => $transaction->category ? [
                            'id' => $transaction->category->id,
                            'name' => $transaction->category->name,
                            'icon' => $transaction->category->icon,
                        ] : null,
                        'account' => $transaction->account ? [
                            'id' => $transaction->account->id,
                            'name' => $transaction->account->name,
                        ] : null,
                        'note' => $transaction->note,
                        'description' => $transaction->description,
                    ];
                }),
                'accounts_summary' => $accountsSummary,
            ],
        ]);
    }
}
