<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\AccountGroup;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AccountController extends Controller
{
    public function index()
    {
        $accounts = Account::where('user_id', Auth::id())
            ->with('group')
            ->orderBy('group_id')
            ->orderBy('name')
            ->get();
        
        $groups = AccountGroup::where('user_id', Auth::id())
            ->orderBy('order')
            ->orderBy('name')
            ->get();
        
        return Inertia::render('Accounts/Index', [
            'accounts' => $accounts,
            'groups' => $groups,
        ]);
    }

    public function create()
    {
        $groups = AccountGroup::where('user_id', Auth::id())
            ->orderBy('order')
            ->orderBy('name')
            ->get();
        
        return Inertia::render('Accounts/Create', [
            'groups' => $groups,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'type' => ['required', 'string', 'in:cash,checking,savings,credit,investment,other'],
            'balance' => ['nullable', 'numeric', 'min:0'],
            'color' => ['nullable', 'string', 'max:7'],
            'group_id' => ['nullable', 'exists:account_groups,id'],
        ]);

        Account::create([
            'user_id' => Auth::id(),
            'group_id' => $validated['group_id'] ?? null,
            'name' => $validated['name'],
            'type' => $validated['type'],
            'balance' => $validated['balance'] ?? 0,
            'color' => $validated['color'] ?? '#3b82f6',
        ]);

        return redirect()->route('accounts.index')->with('success', 'Account created successfully!');
    }

    public function edit(string $id)
    {
        $account = Account::where('user_id', Auth::id())->findOrFail($id);
        $groups = AccountGroup::where('user_id', Auth::id())
            ->orderBy('order')
            ->orderBy('name')
            ->get();
        
        return Inertia::render('Accounts/Edit', [
            'account' => $account,
            'groups' => $groups,
        ]);
    }

    public function update(Request $request, string $id)
    {
        $account = Account::where('user_id', Auth::id())->findOrFail($id);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'type' => ['required', 'string', 'in:cash,checking,savings,credit,investment,other'],
            'balance' => ['nullable', 'numeric', 'min:0'],
            'color' => ['nullable', 'string', 'max:7'],
            'group_id' => ['nullable', 'exists:account_groups,id'],
        ]);

        $account->update($validated);

        return redirect()->route('accounts.index')->with('success', 'Account updated successfully!');
    }

    public function destroy(string $id)
    {
        $account = Account::where('user_id', Auth::id())->findOrFail($id);
        $account->delete();

        return redirect()->route('accounts.index')->with('success', 'Account deleted successfully!');
    }
}
