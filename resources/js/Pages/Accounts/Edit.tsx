import React from 'react';
import Layout from '@/Components/Layout';
import { Head, Link, useForm } from '@inertiajs/react';

interface Group {
    id: number;
    name: string;
    color: string;
}

interface Account {
    id: number;
    name: string;
    type: string;
    balance: number;
    color: string;
    group_id: number | null;
}

interface Props {
    account: Account;
    groups: Group[];
}

export default function EditAccount({ account, groups }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: account.name,
        type: account.type,
        balance: account.balance.toString(),
        color: account.color,
        group_id: account.group_id?.toString() || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/accounts/${account.id}`);
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
        { value: '#6b7280', label: 'Gray' },
        { value: '#4b5563', label: 'Gray Dark' },
        { value: '#9ca3af', label: 'Gray Light' },
        { value: '#14b8a6', label: 'Teal' },
        { value: '#0d9488', label: 'Teal Dark' },
        { value: '#5eead4', label: 'Teal Light' },
        { value: '#f97316', label: 'Orange Red' },
        { value: '#ea580c', label: 'Orange Red Dark' },
        { value: '#fb923c', label: 'Orange Red Light' },
        { value: '#84cc16', label: 'Lime' },
        { value: '#65a30d', label: 'Lime Dark' },
        { value: '#a3e635', label: 'Lime Light' },
        { value: '#eab308', label: 'Yellow' },
        { value: '#ca8a04', label: 'Yellow Dark' },
        { value: '#fde047', label: 'Yellow Light' },
        { value: '#6366f1', label: 'Indigo' },
        { value: '#4f46e5', label: 'Indigo Dark' },
        { value: '#818cf8', label: 'Indigo Light' },
        { value: '#a855f7', label: 'Fuchsia' },
        { value: '#9333ea', label: 'Fuchsia Dark' },
        { value: '#c084fc', label: 'Fuchsia Light' },
        { value: '#64748b', label: 'Slate' },
        { value: '#475569', label: 'Slate Dark' },
        { value: '#94a3b8', label: 'Slate Light' },
    ];

    return (
        <Layout>
            <Head title="Edit Account" />
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <Link
                        href="/accounts"
                        className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-indigo-600 mb-4"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Accounts
                    </Link>
                    <h1 className="text-3xl font-bold text-slate-900">Edit Account</h1>
                    <p className="text-slate-600 mt-2">Update account details</p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 p-8">
                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                                Account Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                                required
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="type" className="block text-sm font-medium text-slate-700 mb-2">
                                Account Type <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="type"
                                value={data.type}
                                onChange={(e) => setData('type', e.target.value)}
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                                required
                            >
                                <option value="checking">Checking</option>
                                <option value="savings">Savings</option>
                                <option value="cash">Cash</option>
                                <option value="credit">Credit Card</option>
                                <option value="investment">Investment</option>
                                <option value="other">Other</option>
                            </select>
                            {errors.type && (
                                <p className="mt-1 text-sm text-red-600">{errors.type}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="group_id" className="block text-sm font-medium text-slate-700 mb-2">
                                Group
                            </label>
                            <div className="flex gap-2 items-center">
                                <select
                                    id="group_id"
                                    value={data.group_id}
                                    onChange={(e) => setData('group_id', e.target.value)}
                                    className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                                >
                                    <option value="">No Group</option>
                                    {groups.map((group) => (
                                        <option key={group.id} value={group.id}>
                                            {group.name}
                                        </option>
                                    ))}
                                </select>
                                <Link
                                    href="/account-groups/create"
                                    className="px-4 py-3 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap"
                                >
                                    + New Group
                                </Link>
                            </div>
                            {errors.group_id && (
                                <p className="mt-1 text-sm text-red-600">{errors.group_id}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="balance" className="block text-sm font-medium text-slate-700 mb-2">
                                Balance
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                                <input
                                    id="balance"
                                    type="number"
                                    step="0.01"
                                    value={data.balance}
                                    onChange={(e) => setData('balance', e.target.value)}
                                    className="w-full pl-8 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                                />
                            </div>
                            {errors.balance && (
                                <p className="mt-1 text-sm text-red-600">{errors.balance}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="color" className="block text-sm font-medium text-slate-700 mb-2">
                                Color
                            </label>
                            <div className="flex gap-2 flex-wrap">
                                {colorOptions.map((color) => (
                                    <button
                                        key={color.value}
                                        type="button"
                                        onClick={() => setData('color', color.value)}
                                        className={`w-12 h-12 rounded-lg border-2 transition-all ${
                                            data.color === color.value
                                                ? 'border-slate-900 scale-110'
                                                : 'border-slate-300 hover:border-slate-400'
                                        }`}
                                        style={{ backgroundColor: color.value }}
                                        title={color.label}
                                    />
                                ))}
                            </div>
                            {errors.color && (
                                <p className="mt-1 text-sm text-red-600">{errors.color}</p>
                            )}
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex-1 py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? 'Updating...' : 'Update Account'}
                            </button>
                            <Link
                                href="/accounts"
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

