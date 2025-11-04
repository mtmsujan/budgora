import React from 'react';
import Layout from '@/Components/Layout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function CreateAccountGroup() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        color: '#6b7280',
        order: 0,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/account-groups');
    };

    const colorOptions = [
        { value: '#3b82f6', label: 'Blue' },
        { value: '#2563eb', label: 'Blue Dark' },
        { value: '#60a5fa', label: 'Blue Light' },
        { value: '#10b981', label: 'Green' },
        { value: '#059669', label: 'Green Dark' },
        { value: '#34d399', label: 'Green Light' },
        { value: '#f59e0b', label: 'Orange' },
        { value: '#d97706', label: 'Orange Dark' },
        { value: '#fbbf24', label: 'Orange Light' },
        { value: '#ef4444', label: 'Red' },
        { value: '#dc2626', label: 'Red Dark' },
        { value: '#f87171', label: 'Red Light' },
        { value: '#8b5cf6', label: 'Purple' },
        { value: '#7c3aed', label: 'Purple Dark' },
        { value: '#a78bfa', label: 'Purple Light' },
        { value: '#ec4899', label: 'Pink' },
        { value: '#db2777', label: 'Pink Dark' },
        { value: '#f472b6', label: 'Pink Light' },
        { value: '#06b6d4', label: 'Cyan' },
        { value: '#0891b2', label: 'Cyan Dark' },
        { value: '#22d3ee', label: 'Cyan Light' },
        { value: '#14b8a6', label: 'Teal' },
        { value: '#0d9488', label: 'Teal Dark' },
        { value: '#5eead4', label: 'Teal Light' },
        { value: '#84cc16', label: 'Lime' },
        { value: '#65a30d', label: 'Lime Dark' },
        { value: '#a3e635', label: 'Lime Light' },
        { value: '#eab308', label: 'Yellow' },
        { value: '#ca8a04', label: 'Yellow Dark' },
        { value: '#facc15', label: 'Yellow Light' },
        { value: '#f97316', label: 'Orange Red' },
        { value: '#ea580c', label: 'Orange Red Dark' },
        { value: '#fb923c', label: 'Orange Red Light' },
        { value: '#6366f1', label: 'Indigo' },
        { value: '#4f46e5', label: 'Indigo Dark' },
        { value: '#818cf8', label: 'Indigo Light' },
        { value: '#64748b', label: 'Slate' },
        { value: '#475569', label: 'Slate Dark' },
        { value: '#94a3b8', label: 'Slate Light' },
        { value: '#78716c', label: 'Stone' },
        { value: '#57534e', label: 'Stone Dark' },
        { value: '#a8a29e', label: 'Stone Light' },
        { value: '#92400e', label: 'Amber' },
        { value: '#78350f', label: 'Amber Dark' },
        { value: '#fbbf24', label: 'Amber Light' },
        { value: '#991b1b', label: 'Rose' },
        { value: '#7f1d1d', label: 'Rose Dark' },
        { value: '#fb7185', label: 'Rose Light' },
    ];

    return (
        <Layout>
            <Head title="Create Account Group" />
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <Link
                        href="/account-groups"
                        className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-4 font-medium"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Groups
                    </Link>
                    <h1 className="text-3xl font-bold text-slate-900">Create Account Group</h1>
                    <p className="text-slate-600 mt-2">Add a new group to organize your accounts</p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 p-8">
                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                                Group Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                                placeholder="e.g., Personal, Business, Investment"
                                required
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="color" className="block text-sm font-medium text-slate-700 mb-2">
                                Color <span className="text-red-500">*</span>
                            </label>
                            <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-3 mb-4">
                                {colorOptions.map((color) => (
                                    <button
                                        key={color.value}
                                        type="button"
                                        onClick={() => setData('color', color.value)}
                                        className={`w-10 h-10 rounded-lg border-2 transition-all ${
                                            data.color === color.value
                                                ? 'border-slate-900 scale-110 shadow-lg'
                                                : 'border-slate-300 hover:border-slate-400'
                                        }`}
                                        style={{ backgroundColor: color.value }}
                                        title={color.label}
                                    />
                                ))}
                            </div>
                            <input
                                id="color"
                                type="text"
                                value={data.color}
                                onChange={(e) => setData('color', e.target.value)}
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none font-mono"
                                placeholder="#6b7280"
                                required
                            />
                            {errors.color && (
                                <p className="mt-1 text-sm text-red-600">{errors.color}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="order" className="block text-sm font-medium text-slate-700 mb-2">
                                Order
                            </label>
                            <input
                                id="order"
                                type="number"
                                value={data.order}
                                onChange={(e) => setData('order', parseInt(e.target.value) || 0)}
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                                min="0"
                            />
                            <p className="mt-1 text-sm text-slate-500">Lower numbers appear first</p>
                            {errors.order && (
                                <p className="mt-1 text-sm text-red-600">{errors.order}</p>
                            )}
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Link
                                href="/account-groups"
                                className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors text-center"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {processing ? 'Creating...' : 'Create Group'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}

