<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TransferController extends Controller
{
    public function create()
    {
        $accounts = Account::where('user_id', Auth::id())->get();

        return Inertia::render('Transactions/Transfer/Create', [
            'accounts' => $accounts,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'date' => ['required', 'date'],
            'amount' => ['required', 'numeric', 'min:0.01'],
            'from_account_id' => ['required', 'exists:accounts,id'],
            'to_account_id' => ['required', 'exists:accounts,id', 'different:from_account_id'],
            'note' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);

        DB::transaction(function () use ($validated) {
            $transaction = Transaction::create([
                'user_id' => Auth::id(),
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
        });

        return redirect()->route('dashboard')->with('success', 'Transfer completed successfully!');
    }
}
