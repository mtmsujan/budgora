<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Account;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TransactionController extends Controller
{
    /**
     * Display a listing of transactions
     */
    public function index(Request $request)
    {
        $transactions = Transaction::where('user_id', $request->user()->id)
            ->with(['category', 'account', 'toAccount'])
            ->orderBy('date', 'desc')
            ->get();
        
        return response()->json([
            'data' => $transactions->map(function ($transaction) {
                return [
                    'id' => $transaction->id,
                    'type' => $transaction->type,
                    'date' => $transaction->date->toISOString(),
                    'amount' => (float) $transaction->amount,
                    'category' => $transaction->category ? [
                        'id' => $transaction->category->id,
                        'name' => $transaction->category->name,
                        'icon' => $transaction->category->icon,
                    ] : null,
                    'account' => $transaction->account ? [
                        'id' => $transaction->account->id,
                        'name' => $transaction->account->name,
                    ] : null,
                    'to_account' => $transaction->toAccount ? [
                        'id' => $transaction->toAccount->id,
                        'name' => $transaction->toAccount->name,
                    ] : null,
                    'note' => $transaction->note,
                    'description' => $transaction->description,
                ];
            }),
        ]);
    }

    /**
     * Display the specified transaction
     */
    public function show(Request $request, string $id)
    {
        $transaction = Transaction::where('user_id', $request->user()->id)
            ->with(['category', 'account', 'toAccount'])
            ->findOrFail($id);
        
        return response()->json([
            'data' => [
                'id' => $transaction->id,
                'type' => $transaction->type,
                'date' => $transaction->date->toISOString(),
                'amount' => (float) $transaction->amount,
                'category' => $transaction->category ? [
                    'id' => $transaction->category->id,
                    'name' => $transaction->category->name,
                    'icon' => $transaction->category->icon,
                ] : null,
                'account' => $transaction->account ? [
                    'id' => $transaction->account->id,
                    'name' => $transaction->account->name,
                ] : null,
                'to_account' => $transaction->toAccount ? [
                    'id' => $transaction->toAccount->id,
                    'name' => $transaction->toAccount->name,
                ] : null,
                'note' => $transaction->note,
                'description' => $transaction->description,
            ],
        ]);
    }

    /**
     * Store a new income transaction
     */
    public function storeIncome(Request $request)
    {
        $validated = $request->validate([
            'date' => ['required', 'date'],
            'amount' => ['required', 'numeric', 'min:0.01'],
            'category_id' => ['nullable', 'exists:categories,id'],
            'account_id' => ['required', 'exists:accounts,id'],
            'note' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);

        $transaction = DB::transaction(function () use ($validated, $request) {
            $transaction = Transaction::create([
                'user_id' => $request->user()->id,
                'type' => 'income',
                'date' => $validated['date'],
                'amount' => $validated['amount'],
                'category_id' => $validated['category_id'] ?? null,
                'account_id' => $validated['account_id'],
                'note' => $validated['note'] ?? null,
                'description' => $validated['description'] ?? null,
            ]);

            // Update account balance
            $account = Account::find($validated['account_id']);
            $account->balance += $validated['amount'];
            $account->save();

            return $transaction;
        });

        return response()->json([
            'data' => [
                'id' => $transaction->id,
                'type' => $transaction->type,
                'date' => $transaction->date->toISOString(),
                'amount' => (float) $transaction->amount,
            ],
            'message' => 'Income transaction created successfully',
        ], 201);
    }

    /**
     * Store a new expense transaction
     */
    public function storeExpense(Request $request)
    {
        $validated = $request->validate([
            'date' => ['required', 'date'],
            'amount' => ['required', 'numeric', 'min:0.01'],
            'category_id' => ['nullable', 'exists:categories,id'],
            'account_id' => ['required', 'exists:accounts,id'],
            'note' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);

        $transaction = DB::transaction(function () use ($validated, $request) {
            $transaction = Transaction::create([
                'user_id' => $request->user()->id,
                'type' => 'expense',
                'date' => $validated['date'],
                'amount' => $validated['amount'],
                'category_id' => $validated['category_id'] ?? null,
                'account_id' => $validated['account_id'],
                'note' => $validated['note'] ?? null,
                'description' => $validated['description'] ?? null,
            ]);

            // Update account balance
            $account = Account::find($validated['account_id']);
            $account->balance -= $validated['amount'];
            $account->save();

            return $transaction;
        });

        return response()->json([
            'data' => [
                'id' => $transaction->id,
                'type' => $transaction->type,
                'date' => $transaction->date->toISOString(),
                'amount' => (float) $transaction->amount,
            ],
            'message' => 'Expense transaction created successfully',
        ], 201);
    }

    /**
     * Store a new transfer transaction
     */
    public function storeTransfer(Request $request)
    {
        $validated = $request->validate([
            'date' => ['required', 'date'],
            'amount' => ['required', 'numeric', 'min:0.01'],
            'from_account_id' => ['required', 'exists:accounts,id'],
            'to_account_id' => ['required', 'exists:accounts,id', 'different:from_account_id'],
            'note' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);

        $transaction = DB::transaction(function () use ($validated, $request) {
            $transaction = Transaction::create([
                'user_id' => $request->user()->id,
                'type' => 'transfer',
                'date' => $validated['date'],
                'amount' => $validated['amount'],
                'account_id' => $validated['from_account_id'],
                'to_account_id' => $validated['to_account_id'],
                'note' => $validated['note'] ?? null,
                'description' => $validated['description'] ?? null,
            ]);

            // Update account balances
            $fromAccount = Account::find($validated['from_account_id']);
            $toAccount = Account::find($validated['to_account_id']);
            
            $fromAccount->balance -= $validated['amount'];
            $toAccount->balance += $validated['amount'];
            
            $fromAccount->save();
            $toAccount->save();

            return $transaction;
        });

        return response()->json([
            'data' => [
                'id' => $transaction->id,
                'type' => $transaction->type,
                'date' => $transaction->date->toISOString(),
                'amount' => (float) $transaction->amount,
            ],
            'message' => 'Transfer transaction created successfully',
        ], 201);
    }

    /**
     * Remove the specified transaction
     */
    public function destroy(Request $request, string $id)
    {
        $transaction = Transaction::where('user_id', $request->user()->id)
            ->findOrFail($id);
        
        $transaction->delete();

        return response()->json([
            'message' => 'Transaction deleted successfully',
        ]);
    }
}
