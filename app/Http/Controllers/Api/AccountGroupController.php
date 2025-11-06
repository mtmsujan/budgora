<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AccountGroup;
use Illuminate\Http\Request;

class AccountGroupController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $groups = AccountGroup::where('user_id', $request->user()->id)
            ->with('accounts')
            ->orderBy('order')
            ->orderBy('name')
            ->get();
        
        return response()->json([
            'data' => $groups->map(function ($group) {
                return [
                    'id' => $group->id,
                    'name' => $group->name,
                    'color' => $group->color,
                    'order' => $group->order,
                    'accounts_count' => $group->accounts->count(),
                ];
            }),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'color' => ['nullable', 'string', 'max:7'],
            'order' => ['nullable', 'integer', 'min:0'],
        ]);

        $group = AccountGroup::create([
            'user_id' => $request->user()->id,
            'name' => $validated['name'],
            'color' => $validated['color'] ?? '#6b7280',
            'order' => $validated['order'] ?? 0,
        ]);

        return response()->json([
            'data' => [
                'id' => $group->id,
                'name' => $group->name,
                'color' => $group->color,
                'order' => $group->order,
            ],
            'message' => 'Account group created successfully',
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, string $id)
    {
        $group = AccountGroup::where('user_id', $request->user()->id)
            ->with('accounts')
            ->findOrFail($id);
        
        return response()->json([
            'data' => [
                'id' => $group->id,
                'name' => $group->name,
                'color' => $group->color,
                'order' => $group->order,
                'accounts' => $group->accounts->map(function ($account) {
                    return [
                        'id' => $account->id,
                        'name' => $account->name,
                        'type' => $account->type,
                        'balance' => (float) $account->balance,
                        'color' => $account->color,
                    ];
                }),
            ],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $group = AccountGroup::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'color' => ['sometimes', 'nullable', 'string', 'max:7'],
            'order' => ['sometimes', 'nullable', 'integer', 'min:0'],
        ]);

        $group->update($validated);

        return response()->json([
            'data' => [
                'id' => $group->id,
                'name' => $group->name,
                'color' => $group->color,
                'order' => $group->order,
            ],
            'message' => 'Account group updated successfully',
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, string $id)
    {
        $group = AccountGroup::where('user_id', $request->user()->id)
            ->findOrFail($id);
        
        $group->delete();

        return response()->json([
            'message' => 'Account group deleted successfully',
        ]);
    }
}
