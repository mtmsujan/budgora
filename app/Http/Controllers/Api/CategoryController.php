<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $categories = Category::where('user_id', $request->user()->id)
            ->orderBy('type')
            ->orderBy('name')
            ->get();
        
        return response()->json([
            'data' => $categories->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'type' => $category->type,
                    'color' => $category->color,
                    'icon' => $category->icon ?? '',
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
            'type' => ['required', 'string', 'in:income,expense,both'],
            'color' => ['nullable', 'string', 'max:7'],
            'icon' => ['nullable', 'string', 'max:255'],
        ]);

        $category = Category::create([
            'user_id' => $request->user()->id,
            'name' => $validated['name'],
            'type' => $validated['type'],
            'color' => $validated['color'] ?? '#6b7280',
            'icon' => $validated['icon'] ?? '',
        ]);

        return response()->json([
            'data' => [
                'id' => $category->id,
                'name' => $category->name,
                'type' => $category->type,
                'color' => $category->color,
                'icon' => $category->icon,
            ],
            'message' => 'Category created successfully',
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, string $id)
    {
        $category = Category::where('user_id', $request->user()->id)
            ->findOrFail($id);
        
        return response()->json([
            'data' => [
                'id' => $category->id,
                'name' => $category->name,
                'type' => $category->type,
                'color' => $category->color,
                'icon' => $category->icon,
            ],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $category = Category::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'type' => ['sometimes', 'required', 'string', 'in:income,expense,both'],
            'color' => ['sometimes', 'nullable', 'string', 'max:7'],
            'icon' => ['sometimes', 'nullable', 'string', 'max:255'],
        ]);

        $category->update($validated);

        return response()->json([
            'data' => [
                'id' => $category->id,
                'name' => $category->name,
                'type' => $category->type,
                'color' => $category->color,
                'icon' => $category->icon,
            ],
            'message' => 'Category updated successfully',
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, string $id)
    {
        $category = Category::where('user_id', $request->user()->id)
            ->findOrFail($id);
        
        $category->delete();

        return response()->json([
            'message' => 'Category deleted successfully',
        ]);
    }
}
