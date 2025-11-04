<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\Category;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ExpenseController extends Controller
{
    public function create()
    {
        $accounts = Account::where('user_id', Auth::id())->get();
        $categories = Category::where('user_id', Auth::id())
            ->whereIn('type', ['expense', 'both'])
            ->get();

        return Inertia::render('Transactions/Expense/Create', [
            'accounts' => $accounts,
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'date' => ['required', 'date'],
            'amount' => ['required', 'numeric', 'min:0.01'],
            'category_id' => ['nullable', 'exists:categories,id'],
            'account_id' => ['required', 'exists:accounts,id'],
            'note' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);

        DB::transaction(function () use ($validated) {
            $transaction = Transaction::create([
                'user_id' => Auth::id(),
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
        });

        return redirect()->route('dashboard')->with('success', 'Expense added successfully!');
    }
}
