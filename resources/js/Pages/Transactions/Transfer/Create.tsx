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

interface Props {
    accounts: Account[];
}

export default function CreateTransfer({ accounts }: Props) {
    const page = usePage<PageProps>();
    const currency = page.props.setting?.currency || 'USD';
    const { data, setData, post, processing, errors } = useForm({
        date: new Date().toISOString().slice(0, 16),
        amount: '',
        from_account_id: '',
        to_account_id: '',
        note: '',
        description: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/transfer');
    };

    return (
        <Layout>
            <Head title="Transfer Money" />
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
                    <h1 className="text-3xl font-bold text-slate-900">Transfer Money</h1>
                    <p className="text-slate-600 mt-2">Transfer funds between your accounts</p>
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
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
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
                                        className="w-full pl-8 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
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
                            {/* From Account */}
                            <div>
                                <label htmlFor="from_account_id" className="block text-sm font-medium text-slate-700 mb-2">
                                    From Account <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="from_account_id"
                                    value={data.from_account_id}
                                    onChange={(e) => setData('from_account_id', e.target.value)}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                    required
                                >
                                    <option value="">Select source account</option>
                                    {accounts.map((account) => (
                                        <option key={account.id} value={account.id}>
                                            {account.name} ({formatCurrency(account.balance, currency)})
                                        </option>
                                    ))}
                                </select>
                                {errors.from_account_id && (
                                    <p className="mt-1 text-sm text-red-600">{errors.from_account_id}</p>
                                )}
                            </div>

                            {/* To Account */}
                            <div>
                                <label htmlFor="to_account_id" className="block text-sm font-medium text-slate-700 mb-2">
                                    To Account <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="to_account_id"
                                    value={data.to_account_id}
                                    onChange={(e) => setData('to_account_id', e.target.value)}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                    required
                                >
                                    <option value="">Select destination account</option>
                                    {accounts
                                        .filter((account) => account.id.toString() !== data.from_account_id)
                                        .map((account) => (
                                            <option key={account.id} value={account.id}>
                                                {account.name} ({formatCurrency(account.balance, currency)})
                                            </option>
                                        ))}
                                </select>
                                {errors.to_account_id && (
                                    <p className="mt-1 text-sm text-red-600">{errors.to_account_id}</p>
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
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                placeholder="Short note about this transfer"
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
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none"
                                placeholder="Additional details about this transfer..."
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
                                className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? 'Processing Transfer...' : 'Transfer Money'}
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

