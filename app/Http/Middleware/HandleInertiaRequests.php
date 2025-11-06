<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\Setting;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $setting = null;
        
        if ($user) {
            $setting = Setting::firstOrCreate(
                ['user_id' => $user->id],
                [
                    'currency' => 'USD',
                    'date_format' => 'Y-m-d',
                    'time_format' => '24',
                    'first_day_of_week' => 'monday',
                    'notifications_enabled' => true,
                    'language' => 'en',
                ]
            );
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user,
            ],
            'flash' => [
                'success' => $request->session()->get('success'),
            ],
            'setting' => $setting ? [
                'currency' => $setting->currency,
                'date_format' => $setting->date_format,
                'time_format' => $setting->time_format,
                'first_day_of_week' => $setting->first_day_of_week,
                'notifications_enabled' => $setting->notifications_enabled,
                'language' => $setting->language,
            ] : null,
        ];
    }
}
