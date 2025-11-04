import React, { useState } from 'react';
import Layout from '@/Components/Layout';
import ConfirmationModal from '@/Components/ConfirmationModal';
import { Head, Link, router } from '@inertiajs/react';

interface Category {
    id: number;
    name: string;
    type: string;
    color: string;
    icon: string;
}

interface Props {
    categories: Category[];
    flash?: {
        success?: string;
    };
}

export default function CategoriesIndex({ categories, flash }: Props) {
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: number | null }>({
        isOpen: false,
        id: null,
    });

    const handleDelete = (id: number) => {
        setDeleteModal({ isOpen: true, id });
    };

    const confirmDelete = () => {
        if (deleteModal.id) {
            router.delete(`/categories/${deleteModal.id}`);
        }
        setDeleteModal({ isOpen: false, id: null });
    };

    const incomeCategories = categories.filter((cat) => cat.type === 'income' || cat.type === 'both');
    const expenseCategories = categories.filter((cat) => cat.type === 'expense' || cat.type === 'both');

    return (
        <Layout>
            <Head title="Categories" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Categories</h1>
                        <p className="text-slate-600 mt-2">Manage your income and expense categories</p>
                    </div>
                    <Link
                        href="/categories/create"
                        className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                    >
                        + Add Category
                    </Link>
                </div>

                {flash?.success && (
                    <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                        {flash.success}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Income Categories */}
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 mb-4">Income Categories</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {incomeCategories.map((category) => (
                                <div
                                    key={category.id}
                                    className="bg-white rounded-xl shadow-md border border-slate-200/60 p-4 hover:shadow-lg transition-shadow"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div
                                                className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg"
                                                style={{ backgroundColor: category.color }}
                                            >
                                                {category.icon || category.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-slate-900">{category.name}</h3>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Link
                                                href={`/categories/${category.id}/edit`}
                                                className="px-3 py-1 text-sm bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(category.id)}
                                                className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors cursor-pointer"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {incomeCategories.length === 0 && (
                            <p className="text-slate-500 text-center py-8">No income categories yet</p>
                        )}
                    </div>

                    {/* Expense Categories */}
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 mb-4">Expense Categories</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {expenseCategories.map((category) => (
                                <div
                                    key={category.id}
                                    className="bg-white rounded-xl shadow-md border border-slate-200/60 p-4 hover:shadow-lg transition-shadow"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div
                                                className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg"
                                                style={{ backgroundColor: category.color }}
                                            >
                                                {category.icon || category.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-slate-900">{category.name}</h3>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Link
                                                href={`/categories/${category.id}/edit`}
                                                className="px-3 py-1 text-sm bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(category.id)}
                                                className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors cursor-pointer"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {expenseCategories.length === 0 && (
                            <p className="text-slate-500 text-center py-8">No expense categories yet</p>
                        )}
                    </div>
                </div>

                {categories.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-2xl shadow-lg border border-slate-200/60 mt-8">
                        <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        <p className="text-slate-500 mb-4">No categories yet</p>
                        <Link
                            href="/categories/create"
                            className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                        >
                            Create Your First Category
                        </Link>
                    </div>
                )}
            </div>

            <ConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, id: null })}
                onConfirm={confirmDelete}
                title="Delete Category?"
                message="Are you sure you want to delete this category? This action cannot be undone."
                confirmText="Delete Category"
                cancelText="Cancel"
                confirmColor="red"
            />
        </Layout>
    );
}

