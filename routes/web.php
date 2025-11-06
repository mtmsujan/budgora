<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\IncomeController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\TransferController;
use App\Http\Controllers\AccountController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\AccountGroupController;
use App\Http\Controllers\SettingsController;

Route::get('/', function () {
    return Inertia::render('Welcome');
});

Route::middleware('guest')->group(function () {
    Route::get('/login', [LoginController::class, 'create'])->name('login');
    Route::post('/login', [LoginController::class, 'store']);
    Route::get('/register', [RegisterController::class, 'create'])->name('register');
    Route::post('/register', [RegisterController::class, 'store']);
});

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::post('/logout', [LogoutController::class, 'destroy'])->name('logout');
    
    // Transaction routes
    Route::get('/income/create', [IncomeController::class, 'create'])->name('income.create');
    Route::post('/income', [IncomeController::class, 'store'])->name('income.store');
    
    Route::get('/expenses/create', [ExpenseController::class, 'create'])->name('expenses.create');
    Route::post('/expenses', [ExpenseController::class, 'store'])->name('expenses.store');
    
    Route::get('/transfer/create', [TransferController::class, 'create'])->name('transfer.create');
    Route::post('/transfer', [TransferController::class, 'store'])->name('transfer.store');
    
    // Account routes
    Route::resource('accounts', AccountController::class);
    
    // Account Group routes
    Route::resource('account-groups', AccountGroupController::class);
    
    // Category routes
    Route::resource('categories', CategoryController::class);
    
    // Settings routes
    Route::get('/settings', [SettingsController::class, 'index'])->name('settings.index');
    Route::put('/settings', [SettingsController::class, 'update'])->name('settings.update');
});
