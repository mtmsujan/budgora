import React from 'react';
import Layout from '@/Components/Layout';
import { Head } from '@inertiajs/react';

export default function Welcome() {
    return (
        <Layout>
            <Head title="Welcome" />
            <div className="relative overflow-hidden">
                {/* Hero Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
                    <div className="text-center">
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
                            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                Take Control
                            </span>
                            <br />
                            <span className="text-slate-900">of Your Money</span>
                        </h1>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
                            Budgora helps you manage income, expenses, and insights with ease.
                            Track your finances and make smarter decisions.
                        </p>
                        <div className="flex justify-center gap-4">
                            <a
                                href="/register"
                                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                            >
                                Get Started Free
                            </a>
                            <a
                                href="/login"
                                className="px-8 py-4 bg-white text-slate-700 font-semibold rounded-xl shadow-md hover:shadow-lg border border-slate-200 transform hover:scale-105 transition-all duration-200"
                            >
                                Sign In
                            </a>
                        </div>
                    </div>

                    {/* Feature Cards */}
                    <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-slate-200/60">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Track Income</h3>
                            <p className="text-slate-600">
                                Easily record and categorize all your income sources. Stay on top of your earnings.
                            </p>
                        </div>

                        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-slate-200/60">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Manage Expenses</h3>
                            <p className="text-slate-600">
                                Monitor your spending habits and identify areas where you can save money.
                            </p>
                        </div>

                        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-slate-200/60">
                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Get Insights</h3>
                            <p className="text-slate-600">
                                Visualize your financial data with beautiful charts and detailed reports.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

