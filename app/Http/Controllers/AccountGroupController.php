<?php

namespace App\Http\Controllers;

use App\Models\AccountGroup;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AccountGroupController extends Controller
{
    public function index()
    {
        $groups = AccountGroup::where('user_id', Auth::id())
            ->with('accounts')
            ->orderBy('order')
            ->orderBy('name')
            ->get();
        
        return Inertia::render('AccountGroups/Index', [
            'groups' => $groups,
        ]);
    }

    public function create()
    {
        return Inertia::render('AccountGroups/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'color' => ['nullable', 'string', 'max:7'],
            'order' => ['nullable', 'integer', 'min:0'],
        ]);

        AccountGroup::create([
            'user_id' => Auth::id(),
            'name' => $validated['name'],
            'color' => $validated['color'] ?? '#6b7280',
            'order' => $validated['order'] ?? 0,
        ]);

        return redirect()->route('account-groups.index')->with('success', 'Account group created successfully!');
    }

    public function edit(string $id)
    {
        $group = AccountGroup::where('user_id', Auth::id())->findOrFail($id);
        return Inertia::render('AccountGroups/Edit', [
            'group' => $group,
        ]);
    }

    public function update(Request $request, string $id)
    {
        $group = AccountGroup::where('user_id', Auth::id())->findOrFail($id);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'color' => ['nullable', 'string', 'max:7'],
            'order' => ['nullable', 'integer', 'min:0'],
        ]);

        $group->update($validated);

        return redirect()->route('account-groups.index')->with('success', 'Account group updated successfully!');
    }

    public function destroy(string $id)
    {
        $group = AccountGroup::where('user_id', Auth::id())->findOrFail($id);
        $group->delete();

        return redirect()->route('account-groups.index')->with('success', 'Account group deleted successfully!');
    }
}
