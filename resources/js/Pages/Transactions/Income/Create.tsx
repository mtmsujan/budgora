import React from 'react';
import Layout from '@/Components/Layout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { formatCurrency } from '@/utils/currency';

interface Account {
    id: number;
    name: string;
    balance: number;
}

interface Category {
    id: number;
    name: string;
    type: string;
}

interface Props {
    accounts: Account[];
    categories: Category[];
}

export default function CreateIncome({ accounts, categories }: Props) {
    const page = usePage<PageProps>();
    const currency = page.props.setting?.currency || 'USD';
    const { data, setData, post, processing, errors } = useForm({
        date: new Date().toISOString().slice(0, 16),
        amount: '',
        category_id: '',
        account_id: '',
        note: '',
        description: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/income');
    };

    return (
        <Layout>
            <Head title="Add Income" />
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
                    <h1 className="text-3xl font-bold text-slate-900">Add Income</h1>
                    <p className="text-slate-600 mt-2">Record a new income transaction</p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 p-8">
                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Date and Time */}
                            <div>
                                <label htmlFor="date" className="block text-sm font-medium text-slate-700 mb-2">
                                    Date and Time <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="date"
                                    type="datetime-local"
                                    value={data.date}
                                    onChange={(e) => setData('date', e.target.value)}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                                    required
                                />
                                {errors.date && (
                                    <p className="mt-1 text-sm text-red-600">{errors.date}</p>
                                )}
                            </div>

                            {/* Amount */}
                            <div>
                                <label htmlFor="amount" className="block text-sm font-medium text-slate-700 mb-2">
                                    Amount <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                                    <input
                                        id="amount"
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        value={data.amount}
                                        onChange={(e) => setData('amount', e.target.value)}
                                        className="w-full pl-8 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                                        placeholder="0.00"
                                        required
                                    />
                                </div>
                                {errors.amount && (
                                    <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Category */}
                            <div>
                                <label htmlFor="category_id" className="block text-sm font-medium text-slate-700 mb-2">
                                    Category
                                </label>
                                <select
                                    id="category_id"
                                    value={data.category_id}
                                    onChange={(e) => setData('category_id', e.target.value)}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                                >
                                    <option value="">Select a category</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.category_id && (
                                    <p className="mt-1 text-sm text-red-600">{errors.category_id}</p>
                                )}
                            </div>

                            {/* Account */}
                            <div>
                                <label htmlFor="account_id" className="block text-sm font-medium text-slate-700 mb-2">
                                    Account <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="account_id"
                                    value={data.account_id}
                                    onChange={(e) => setData('account_id', e.target.value)}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                                    required
                                >
                                    <option value="">Select an account</option>
                                    {accounts.map((account) => (
                                        <option key={account.id} value={account.id}>
                                            {account.name} ({formatCurrency(account.balance, currency)})
                                        </option>
                                    ))}
                                </select>
                                {errors.account_id && (
                                    <p className="mt-1 text-sm text-red-600">{errors.account_id}</p>
                                )}
                            </div>
                        </div>

                        {/* Note */}
                        <div>
                            <label htmlFor="note" className="block text-sm font-medium text-slate-700 mb-2">
                                Note
                            </label>
                            <input
                                id="note"
                                type="text"
                                value={data.note}
                                onChange={(e) => setData('note', e.target.value)}
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                                placeholder="Short note about this transaction"
                                maxLength={255}
                            />
                            {errors.note && (
                                <p className="mt-1 text-sm text-red-600">{errors.note}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
                                Description
                            </label>
                            <textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                rows={4}
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none resize-none"
                                placeholder="Additional details about this income..."
                            />
                            {errors.description && (
                                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="flex gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex-1 py-3 px-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? 'Adding Income...' : 'Add Income'}
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

