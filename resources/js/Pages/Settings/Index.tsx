import React from 'react';
import Layout from '@/Components/Layout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { CURRENCY_SYMBOLS } from '@/utils/currency';

interface Setting {
    id: number;
    currency: string;
    date_format: string;
    time_format: string;
    first_day_of_week: string;
    notifications_enabled: boolean;
    language: string;
}

interface Props {
    setting: Setting;
}

export default function Settings({ setting }: Props) {
    const page = usePage<PageProps>();
    const { data, setData, put, processing, errors } = useForm({
        currency: setting.currency || 'USD',
        date_format: setting.date_format || 'Y-m-d',
        time_format: setting.time_format || '24',
        first_day_of_week: setting.first_day_of_week || 'monday',
        notifications_enabled: setting.notifications_enabled ?? true,
        language: setting.language || 'en',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/settings', {
            preserveScroll: true,
            onSuccess: () => {
                // Reload page to get updated settings
                window.location.reload();
            },
        });
    };

    // Comprehensive currency list
    const currencies = [
        { code: 'USD', symbol: CURRENCY_SYMBOLS['USD'], name: 'US Dollar' },
        { code: 'EUR', symbol: CURRENCY_SYMBOLS['EUR'], name: 'Euro' },
        { code: 'GBP', symbol: CURRENCY_SYMBOLS['GBP'], name: 'British Pound' },
        { code: 'JPY', symbol: CURRENCY_SYMBOLS['JPY'], name: 'Japanese Yen' },
        { code: 'AUD', symbol: CURRENCY_SYMBOLS['AUD'], name: 'Australian Dollar' },
        { code: 'CAD', symbol: CURRENCY_SYMBOLS['CAD'], name: 'Canadian Dollar' },
        { code: 'CHF', symbol: CURRENCY_SYMBOLS['CHF'], name: 'Swiss Franc' },
        { code: 'CNY', symbol: CURRENCY_SYMBOLS['CNY'], name: 'Chinese Yuan' },
        { code: 'INR', symbol: CURRENCY_SYMBOLS['INR'], name: 'Indian Rupee' },
        { code: 'BRL', symbol: CURRENCY_SYMBOLS['BRL'], name: 'Brazilian Real' },
        { code: 'ZAR', symbol: CURRENCY_SYMBOLS['ZAR'], name: 'South African Rand' },
        { code: 'MXN', symbol: CURRENCY_SYMBOLS['MXN'], name: 'Mexican Peso' },
        { code: 'SGD', symbol: CURRENCY_SYMBOLS['SGD'], name: 'Singapore Dollar' },
        { code: 'HKD', symbol: CURRENCY_SYMBOLS['HKD'], name: 'Hong Kong Dollar' },
        { code: 'NZD', symbol: CURRENCY_SYMBOLS['NZD'], name: 'New Zealand Dollar' },
        { code: 'BDT', symbol: CURRENCY_SYMBOLS['BDT'], name: 'Bangladeshi Taka' },
        { code: 'PKR', symbol: CURRENCY_SYMBOLS['PKR'], name: 'Pakistani Rupee' },
        { code: 'LKR', symbol: CURRENCY_SYMBOLS['LKR'], name: 'Sri Lankan Rupee' },
        { code: 'NPR', symbol: CURRENCY_SYMBOLS['NPR'], name: 'Nepalese Rupee' },
        { code: 'THB', symbol: CURRENCY_SYMBOLS['THB'], name: 'Thai Baht' },
        { code: 'MYR', symbol: CURRENCY_SYMBOLS['MYR'], name: 'Malaysian Ringgit' },
        { code: 'IDR', symbol: CURRENCY_SYMBOLS['IDR'], name: 'Indonesian Rupiah' },
        { code: 'PHP', symbol: CURRENCY_SYMBOLS['PHP'], name: 'Philippine Peso' },
        { code: 'VND', symbol: CURRENCY_SYMBOLS['VND'], name: 'Vietnamese Dong' },
        { code: 'KRW', symbol: CURRENCY_SYMBOLS['KRW'], name: 'South Korean Won' },
        { code: 'TWD', symbol: CURRENCY_SYMBOLS['TWD'], name: 'Taiwan Dollar' },
        { code: 'AED', symbol: CURRENCY_SYMBOLS['AED'], name: 'UAE Dirham' },
        { code: 'SAR', symbol: CURRENCY_SYMBOLS['SAR'], name: 'Saudi Riyal' },
        { code: 'ILS', symbol: CURRENCY_SYMBOLS['ILS'], name: 'Israeli Shekel' },
        { code: 'TRY', symbol: CURRENCY_SYMBOLS['TRY'], name: 'Turkish Lira' },
        { code: 'RUB', symbol: CURRENCY_SYMBOLS['RUB'], name: 'Russian Ruble' },
        { code: 'PLN', symbol: CURRENCY_SYMBOLS['PLN'], name: 'Polish Zloty' },
        { code: 'SEK', symbol: CURRENCY_SYMBOLS['SEK'], name: 'Swedish Krona' },
        { code: 'NOK', symbol: CURRENCY_SYMBOLS['NOK'], name: 'Norwegian Krone' },
        { code: 'DKK', symbol: CURRENCY_SYMBOLS['DKK'], name: 'Danish Krone' },
        { code: 'CZK', symbol: CURRENCY_SYMBOLS['CZK'], name: 'Czech Koruna' },
        { code: 'HUF', symbol: CURRENCY_SYMBOLS['HUF'], name: 'Hungarian Forint' },
        { code: 'RON', symbol: CURRENCY_SYMBOLS['RON'], name: 'Romanian Leu' },
        { code: 'BGN', symbol: CURRENCY_SYMBOLS['BGN'], name: 'Bulgarian Lev' },
        { code: 'HRK', symbol: CURRENCY_SYMBOLS['HRK'], name: 'Croatian Kuna' },
        { code: 'EGP', symbol: CURRENCY_SYMBOLS['EGP'], name: 'Egyptian Pound' },
        { code: 'NGN', symbol: CURRENCY_SYMBOLS['NGN'], name: 'Nigerian Naira' },
        { code: 'KES', symbol: CURRENCY_SYMBOLS['KES'], name: 'Kenyan Shilling' },
        { code: 'ETB', symbol: CURRENCY_SYMBOLS['ETB'], name: 'Ethiopian Birr' },
        { code: 'GHS', symbol: CURRENCY_SYMBOLS['GHS'], name: 'Ghanaian Cedi' },
        { code: 'TZS', symbol: CURRENCY_SYMBOLS['TZS'], name: 'Tanzanian Shilling' },
        { code: 'UGX', symbol: CURRENCY_SYMBOLS['UGX'], name: 'Ugandan Shilling' },
        { code: 'MAD', symbol: CURRENCY_SYMBOLS['MAD'], name: 'Moroccan Dirham' },
        { code: 'TND', symbol: CURRENCY_SYMBOLS['TND'], name: 'Tunisian Dinar' },
        { code: 'DZD', symbol: CURRENCY_SYMBOLS['DZD'], name: 'Algerian Dinar' },
        { code: 'ARS', symbol: CURRENCY_SYMBOLS['ARS'], name: 'Argentine Peso' },
        { code: 'CLP', symbol: CURRENCY_SYMBOLS['CLP'], name: 'Chilean Peso' },
        { code: 'COP', symbol: CURRENCY_SYMBOLS['COP'], name: 'Colombian Peso' },
        { code: 'PEN', symbol: CURRENCY_SYMBOLS['PEN'], name: 'Peruvian Sol' },
        { code: 'UYU', symbol: CURRENCY_SYMBOLS['UYU'], name: 'Uruguayan Peso' },
    ].sort((a, b) => a.name.localeCompare(b.name));

    const dateFormats = [
        { value: 'Y-m-d', label: 'YYYY-MM-DD (2024-11-06)' },
        { value: 'm/d/Y', label: 'MM/DD/YYYY (11/06/2024)' },
        { value: 'd/m/Y', label: 'DD/MM/YYYY (06/11/2024)' },
        { value: 'd.m.Y', label: 'DD.MM.YYYY (06.11.2024)' },
        { value: 'M d, Y', label: 'Nov 06, 2024' },
        { value: 'F d, Y', label: 'November 06, 2024' },
    ];

    const languages = [
        { code: 'en', name: 'English' },
        { code: 'bn', name: 'Bangla (বাংলা)' },
        { code: 'es', name: 'Spanish (Español)' },
        { code: 'fr', name: 'French (Français)' },
        { code: 'de', name: 'German (Deutsch)' },
        { code: 'it', name: 'Italian (Italiano)' },
        { code: 'pt', name: 'Portuguese (Português)' },
        { code: 'zh', name: 'Chinese (中文)' },
        { code: 'ja', name: 'Japanese (日本語)' },
        { code: 'ko', name: 'Korean (한국어)' },
        { code: 'ar', name: 'Arabic (العربية)' },
        { code: 'hi', name: 'Hindi (हिन्दी)' },
        { code: 'ru', name: 'Russian (Русский)' },
        { code: 'tr', name: 'Turkish (Türkçe)' },
        { code: 'pl', name: 'Polish (Polski)' },
        { code: 'nl', name: 'Dutch (Nederlands)' },
        { code: 'sv', name: 'Swedish (Svenska)' },
        { code: 'no', name: 'Norwegian (Norsk)' },
        { code: 'da', name: 'Danish (Dansk)' },
        { code: 'fi', name: 'Finnish (Suomi)' },
        { code: 'th', name: 'Thai (ไทย)' },
        { code: 'vi', name: 'Vietnamese (Tiếng Việt)' },
        { code: 'id', name: 'Indonesian (Bahasa Indonesia)' },
        { code: 'ms', name: 'Malay (Bahasa Melayu)' },
        { code: 'ta', name: 'Tamil (தமிழ்)' },
        { code: 'te', name: 'Telugu (తెలుగు)' },
        { code: 'mr', name: 'Marathi (मराठी)' },
        { code: 'ur', name: 'Urdu (اردو)' },
        { code: 'fa', name: 'Persian (فارسی)' },
        { code: 'he', name: 'Hebrew (עברית)' },
    ].sort((a, b) => a.name.localeCompare(b.name));

    const daysOfWeek = [
        { value: 'monday', label: 'Monday' },
        { value: 'tuesday', label: 'Tuesday' },
        { value: 'wednesday', label: 'Wednesday' },
        { value: 'thursday', label: 'Thursday' },
        { value: 'friday', label: 'Friday' },
        { value: 'saturday', label: 'Saturday' },
        { value: 'sunday', label: 'Sunday' },
    ];

    return (
        <Layout>
            <Head title="Settings" />
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-indigo-600 mb-4"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
                    <p className="text-slate-600 mt-2">Manage your application preferences</p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 p-8">
                    <form onSubmit={submit} className="space-y-8">
                        {/* Currency */}
                        <div>
                            <label htmlFor="currency" className="block text-sm font-medium text-slate-700 mb-2">
                                Currency <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="currency"
                                value={data.currency}
                                onChange={(e) => setData('currency', e.target.value)}
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                            >
                                {currencies.map((currency) => (
                                    <option key={currency.code} value={currency.code}>
                                        {currency.symbol} {currency.name} ({currency.code})
                                    </option>
                                ))}
                            </select>
                            {errors.currency && (
                                <p className="mt-1 text-sm text-red-600">{errors.currency}</p>
                            )}
                        </div>

                        {/* Date Format */}
                        <div>
                            <label htmlFor="date_format" className="block text-sm font-medium text-slate-700 mb-2">
                                Date Format <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="date_format"
                                value={data.date_format}
                                onChange={(e) => setData('date_format', e.target.value)}
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                            >
                                {dateFormats.map((format) => (
                                    <option key={format.value} value={format.value}>
                                        {format.label}
                                    </option>
                                ))}
                            </select>
                            {errors.date_format && (
                                <p className="mt-1 text-sm text-red-600">{errors.date_format}</p>
                            )}
                        </div>

                        {/* Time Format */}
                        <div>
                            <label htmlFor="time_format" className="block text-sm font-medium text-slate-700 mb-2">
                                Time Format <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="time_format"
                                value={data.time_format}
                                onChange={(e) => setData('time_format', e.target.value)}
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                            >
                                <option value="24">24-hour (14:30)</option>
                                <option value="12">12-hour (2:30 PM)</option>
                            </select>
                            {errors.time_format && (
                                <p className="mt-1 text-sm text-red-600">{errors.time_format}</p>
                            )}
                        </div>

                        {/* First Day of Week */}
                        <div>
                            <label htmlFor="first_day_of_week" className="block text-sm font-medium text-slate-700 mb-2">
                                First Day of Week <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="first_day_of_week"
                                value={data.first_day_of_week}
                                onChange={(e) => setData('first_day_of_week', e.target.value)}
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                            >
                                {daysOfWeek.map((day) => (
                                    <option key={day.value} value={day.value}>
                                        {day.label}
                                    </option>
                                ))}
                            </select>
                            {errors.first_day_of_week && (
                                <p className="mt-1 text-sm text-red-600">{errors.first_day_of_week}</p>
                            )}
                        </div>

                        {/* Language */}
                        <div>
                            <label htmlFor="language" className="block text-sm font-medium text-slate-700 mb-2">
                                Language <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="language"
                                value={data.language}
                                onChange={(e) => setData('language', e.target.value)}
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                            >
                                {languages.map((lang) => (
                                    <option key={lang.code} value={lang.code}>
                                        {lang.name}
                                    </option>
                                ))}
                            </select>
                            {errors.language && (
                                <p className="mt-1 text-sm text-red-600">{errors.language}</p>
                            )}
                        </div>

                        {/* Notifications */}
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                            <div>
                                <label htmlFor="notifications_enabled" className="block text-sm font-medium text-slate-700">
                                    Enable Notifications
                                </label>
                                <p className="text-sm text-slate-500 mt-1">Receive notifications for important updates</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    id="notifications_enabled"
                                    checked={data.notifications_enabled}
                                    onChange={(e) => setData('notifications_enabled', e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <div className="flex gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex-1 py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? 'Saving...' : 'Save Settings'}
                            </button>
                            <Link
                                href="/dashboard"
                                className="px-6 py-3 bg-white text-slate-700 font-semibold rounded-lg shadow-md hover:shadow-lg border border-slate-200 transition-all"
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}

