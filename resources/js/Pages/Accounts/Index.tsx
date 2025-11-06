import React, { useState } from 'react';
import Layout from '@/Components/Layout';
import ConfirmationModal from '@/Components/ConfirmationModal';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { formatCurrency } from '@/utils/currency';

interface Account {
    id: number;
    name: string;
    type: string;
    balance: number;
    color: string;
    group: {
        id: number;
        name: string;
        color: string;
    } | null;
}

interface Group {
    id: number;
    name: string;
    color: string;
    order: number;
}

interface Props {
    accounts: Account[];
    groups: Group[];
    flash?: {
        success?: string;
    };
}

export default function AccountsIndex({ accounts, groups, flash }: Props) {
    const page = usePage<PageProps>();
    const currency = page.props.setting?.currency || 'USD';
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: number | null }>({
        isOpen: false,
        id: null,
    });

    const handleDelete = (id: number) => {
        setDeleteModal({ isOpen: true, id });
    };

    const confirmDelete = () => {
        if (deleteModal.id) {
            router.delete(`/accounts/${deleteModal.id}`);
        }
        setDeleteModal({ isOpen: false, id: null });
    };

    // Group accounts by group
    const accountsByGroup = groups.reduce((acc, group) => {
        acc[group.id] = accounts.filter((account) => account.group?.id === group.id);
        return acc;
    }, {} as Record<number, Account[]>);

    const ungroupedAccounts = accounts.filter((account) => !account.group);

    return (
        <Layout>
            <Head title="Accounts" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Accounts</h1>
                        <p className="text-slate-600 mt-2">Manage your accounts and groups</p>
                    </div>
                    <div className="flex gap-3">
                        <Link
                            href="/account-groups"
                            className="px-6 py-3 bg-white text-slate-700 font-semibold rounded-lg shadow-md hover:shadow-lg border border-slate-200 transition-all"
                        >
                            Manage Groups
                        </Link>
                        <Link
                            href="/accounts/create"
                            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                        >
                            + Add Account
                        </Link>
                    </div>
                </div>

                {flash?.success && (
                    <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                        {flash.success}
                    </div>
                )}

                {/* Grouped Accounts */}
                {groups.map((group) => {
                    const groupAccounts = accountsByGroup[group.id] || [];
                    if (groupAccounts.length === 0) return null;

                    return (
                        <div key={group.id} className="mb-8">
                            <div className="flex items-center gap-3 mb-4">
                                <div
                                    className="w-4 h-4 rounded"
                                    style={{ backgroundColor: group.color }}
                                />
                                <h2 className="text-xl font-bold text-slate-900">{group.name}</h2>
                                <span className="text-sm text-slate-500">({groupAccounts.length})</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {groupAccounts.map((account) => (
                                    <div
                                        key={account.id}
                                        className="bg-white rounded-2xl shadow-lg border border-slate-200/60 p-6 hover:shadow-xl transition-shadow"
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center space-x-3">
                                                <div
                                                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                                                    style={{ backgroundColor: account.color }}
                                                >
                                                    {account.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-slate-900">{account.name}</h3>
                                                    <p className="text-sm text-slate-500 capitalize">{account.type}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mb-4">
                                            <p className="text-2xl font-bold text-slate-900">
                                                {formatCurrency(account.balance, currency)}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Link
                                                href={`/accounts/${account.id}/edit`}
                                                className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors text-center"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(account.id)}
                                                className="flex-1 px-4 py-2 bg-red-100 text-red-700 font-medium rounded-lg hover:bg-red-200 transition-colors cursor-pointer"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}

                {/* Ungrouped Accounts */}
                {ungroupedAccounts.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-slate-900 mb-4">Ungrouped Accounts</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {ungroupedAccounts.map((account) => (
                                <div
                                    key={account.id}
                                    className="bg-white rounded-2xl shadow-lg border border-slate-200/60 p-6 hover:shadow-xl transition-shadow"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center space-x-3">
                                            <div
                                                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                                                style={{ backgroundColor: account.color }}
                                            >
                                                {account.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900">{account.name}</h3>
                                                <p className="text-sm text-slate-500 capitalize">{account.type}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <p className="text-2xl font-bold text-slate-900">
                                            ${Number(account.balance).toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Link
                                            href={`/accounts/${account.id}/edit`}
                                            className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors text-center"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(account.id)}
                                            className="flex-1 px-4 py-2 bg-red-100 text-red-700 font-medium rounded-lg hover:bg-red-200 transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {accounts.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-2xl shadow-lg border border-slate-200/60">
                        <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        <p className="text-slate-500 mb-4">No accounts yet</p>
                        <Link
                            href="/accounts/create"
                            className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                        >
                            Create Your First Account
                        </Link>
                    </div>
                )}
            </div>

            <ConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, id: null })}
                onConfirm={confirmDelete}
                title="Delete Account?"
                message="Are you sure you want to delete this account? This action cannot be undone."
                confirmText="Delete Account"
                cancelText="Cancel"
                confirmColor="red"
            />
        </Layout>
    );
}
