<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SettingsController extends Controller
{
    public function index()
    {
        $setting = Setting::firstOrCreate(
            ['user_id' => Auth::id()],
            [
                'currency' => 'USD',
                'date_format' => 'Y-m-d',
                'time_format' => '24',
                'first_day_of_week' => 'monday',
                'notifications_enabled' => true,
                'language' => 'en',
            ]
        );

        return Inertia::render('Settings/Index', [
            'setting' => $setting,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'currency' => ['required', 'string', 'size:3'],
            'date_format' => ['required', 'string', 'max:20'],
            'time_format' => ['required', 'string', 'in:12,24'],
            'first_day_of_week' => ['required', 'string', 'in:monday,tuesday,wednesday,thursday,friday,saturday,sunday'],
            'notifications_enabled' => ['boolean'],
            'language' => ['required', 'string', 'max:5'],
        ]);

        $setting = Setting::updateOrCreate(
            ['user_id' => Auth::id()],
            $validated
        );

        return redirect()->route('settings.index')->with('success', 'Settings updated successfully!');
    }
}
