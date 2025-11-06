<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AccountResource;
use App\Models\Account;
use App\Models\AccountGroup;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AccountController extends Controller
{
    /**
     * Display a listing of accounts
     */
    public function index(Request $request)
    {
        $accounts = Account::where('user_id', $request->user()->id)
            ->with('group')
            ->orderBy('group_id')
            ->orderBy('name')
            ->get();
        
        return response()->json([
            'data' => AccountResource::collection($accounts),
        ]);
    }

    /**
     * Store a newly created account
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'type' => ['required', 'string', 'in:cash,checking,savings,credit,investment,other'],
            'balance' => ['nullable', 'numeric', 'min:0'],
            'color' => ['nullable', 'string', 'max:7'],
            'group_id' => ['nullable', 'exists:account_groups,id'],
        ]);

        $account = Account::create([
            'user_id' => $request->user()->id,
            'group_id' => $validated['group_id'] ?? null,
            'name' => $validated['name'],
            'type' => $validated['type'],
            'balance' => $validated['balance'] ?? 0,
            'color' => $validated['color'] ?? '#3b82f6',
        ]);

        return response()->json([
            'data' => new AccountResource($account->load('group')),
        ]);
    }

    /**
     * Display the specified account
     */
    public function show(Request $request, string $id)
    {
        $account = Account::where('user_id', $request->user()->id)->findOrFail($id);
        return response()->json([
            'data' => new AccountResource($account->load('group')),
        ]);
    }

    /**
     * Update the specified account
     */
    public function update(Request $request, string $id)
    {
        $account = Account::where('user_id', $request->user()->id)->findOrFail($id);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'type' => ['required', 'string', 'in:cash,checking,savings,credit,investment,other'],
            'balance' => ['nullable', 'numeric', 'min:0'],
            'color' => ['nullable', 'string', 'max:7'],
            'group_id' => ['nullable', 'exists:account_groups,id'],
        ]);

        $account->update($validated);

        return response()->json([
            'data' => new AccountResource($account->load('group')),
        ]);
    }

    /**
     * Remove the specified account
     */
    public function destroy(Request $request, string $id)
    {
        $account = Account::where('user_id', $request->user()->id)->findOrFail($id);
        $account->delete();

        return response()->json(['message' => 'Account deleted successfully'], 200);
    }
}
