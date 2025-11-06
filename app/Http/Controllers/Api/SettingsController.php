<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    public function index(Request $request)
    {
        $setting = Setting::firstOrCreate(
            ['user_id' => $request->user()->id],
            [
                'currency' => 'USD',
                'date_format' => 'Y-m-d',
                'time_format' => '24',
                'first_day_of_week' => 'monday',
                'notifications_enabled' => true,
                'language' => 'en',
            ]
        );

        return response()->json([
            'data' => [
                'id' => $setting->id,
                'currency' => $setting->currency,
                'date_format' => $setting->date_format,
                'time_format' => $setting->time_format,
                'first_day_of_week' => $setting->first_day_of_week,
                'notifications_enabled' => $setting->notifications_enabled,
                'language' => $setting->language,
            ],
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'currency' => ['sometimes', 'required', 'string', 'size:3'],
            'date_format' => ['sometimes', 'required', 'string', 'max:20'],
            'time_format' => ['sometimes', 'required', 'string', 'in:12,24'],
            'first_day_of_week' => ['sometimes', 'required', 'string', 'in:monday,tuesday,wednesday,thursday,friday,saturday,sunday'],
            'notifications_enabled' => ['sometimes', 'boolean'],
            'language' => ['sometimes', 'required', 'string', 'max:5'],
        ]);

        $setting = Setting::updateOrCreate(
            ['user_id' => $request->user()->id],
            $validated
        );

        return response()->json([
            'data' => [
                'id' => $setting->id,
                'currency' => $setting->currency,
                'date_format' => $setting->date_format,
                'time_format' => $setting->time_format,
                'first_day_of_week' => $setting->first_day_of_week,
                'notifications_enabled' => $setting->notifications_enabled,
                'language' => $setting->language,
            ],
            'message' => 'Settings updated successfully',
        ]);
    }
}
