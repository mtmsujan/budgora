import React, { useState } from 'react';
import Layout from '@/Components/Layout';
import ConfirmationModal from '@/Components/ConfirmationModal';
import { Head, Link, router } from '@inertiajs/react';

interface Account {
    id: number;
    name: string;
}

interface Group {
    id: number;
    name: string;
    color: string;
    order: number;
    accounts: Account[];
}

interface Props {
    groups: Group[];
    flash?: {
        success?: string;
    };
}

export default function AccountGroupsIndex({ groups, flash }: Props) {
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: number | null }>({
        isOpen: false,
        id: null,
    });

    const handleDelete = (id: number) => {
        setDeleteModal({ isOpen: true, id });
    };

    const confirmDelete = () => {
        if (deleteModal.id) {
            router.delete(`/account-groups/${deleteModal.id}`);
        }
        setDeleteModal({ isOpen: false, id: null });
    };

    return (
        <Layout>
            <Head title="Account Groups" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Account Groups</h1>
                        <p className="text-slate-600 mt-2">Organize your accounts into groups</p>
                    </div>
                    <Link
                        href="/account-groups/create"
                        className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                    >
                        + Add Group
                    </Link>
                </div>

                {flash?.success && (
                    <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                        {flash.success}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groups.map((group) => (
                        <div
                            key={group.id}
                            className="bg-white rounded-2xl shadow-lg border border-slate-200/60 p-6 hover:shadow-xl transition-shadow"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div
                                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md"
                                        style={{ backgroundColor: group.color }}
                                    >
                                        {group.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900">{group.name}</h3>
                                        <p className="text-sm text-slate-500">
                                            {group.accounts.length} account{group.accounts.length !== 1 ? 's' : ''}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            {group.accounts.length > 0 && (
                                <div className="mb-4">
                                    <div className="flex flex-wrap gap-2">
                                        {group.accounts.slice(0, 3).map((account) => (
                                            <span
                                                key={account.id}
                                                className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-md"
                                            >
                                                {account.name}
                                            </span>
                                        ))}
                                        {group.accounts.length > 3 && (
                                            <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-md">
                                                +{group.accounts.length - 3} more
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}
                            <div className="flex gap-2">
                                <Link
                                    href={`/account-groups/${group.id}/edit`}
                                    className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors text-center"
                                >
                                    Edit
                                </Link>
                                <button
                                    onClick={() => handleDelete(group.id)}
                                    className="flex-1 px-4 py-2 bg-red-100 text-red-700 font-medium rounded-lg hover:bg-red-200 transition-colors cursor-pointer"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {groups.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-2xl shadow-lg border border-slate-200/60">
                        <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <p className="text-slate-500 mb-4">No account groups yet</p>
                        <Link
                            href="/account-groups/create"
                            className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                        >
                            Create Your First Group
                        </Link>
                    </div>
                )}
            </div>

            <ConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, id: null })}
                onConfirm={confirmDelete}
                title="Delete Account Group?"
                message="Are you sure you want to delete this group? Accounts in this group will be ungrouped. This action cannot be undone."
                confirmText="Delete Group"
                cancelText="Cancel"
                confirmColor="red"
            />
        </Layout>
    );
}

