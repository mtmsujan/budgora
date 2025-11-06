<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Auth\ApiAuthController;
use App\Http\Controllers\Api\AccountController as ApiAccountController;
use App\Http\Controllers\Api\AccountGroupController as ApiAccountGroupController;
use App\Http\Controllers\Api\CategoryController as ApiCategoryController;
use App\Http\Controllers\Api\TransactionController as ApiTransactionController;
use App\Http\Controllers\Api\DashboardController as ApiDashboardController;
use App\Http\Controllers\Api\SettingsController as ApiSettingsController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public routes
Route::prefix('v1')->group(function () {
    // Authentication routes
    Route::post('/auth/register', [ApiAuthController::class, 'register']);
    Route::post('/auth/login', [ApiAuthController::class, 'login']);
    
    // Protected routes
    Route::middleware('auth:sanctum')->group(function () {
        // Auth
        Route::post('/auth/logout', [ApiAuthController::class, 'logout']);
        Route::get('/auth/user', [ApiAuthController::class, 'user']);
        
        // Dashboard
        Route::get('/dashboard', [ApiDashboardController::class, 'index']);
        
        // Settings
        Route::get('/settings', [ApiSettingsController::class, 'index']);
        Route::put('/settings', [ApiSettingsController::class, 'update']);
        
        // Accounts
        Route::apiResource('accounts', ApiAccountController::class)->names([
            'index' => 'api.accounts.index',
            'show' => 'api.accounts.show',
            'store' => 'api.accounts.store',
            'update' => 'api.accounts.update',
            'destroy' => 'api.accounts.destroy',
        ]);
        
        // Account Groups
        Route::apiResource('account-groups', ApiAccountGroupController::class)->names([
            'index' => 'api.account-groups.index',
            'show' => 'api.account-groups.show',
            'store' => 'api.account-groups.store',
            'update' => 'api.account-groups.update',
            'destroy' => 'api.account-groups.destroy',
        ]);
        
        // Categories
        Route::apiResource('categories', ApiCategoryController::class)->names([
            'index' => 'api.categories.index',
            'show' => 'api.categories.show',
            'store' => 'api.categories.store',
            'update' => 'api.categories.update',
            'destroy' => 'api.categories.destroy',
        ]);
        
        // Transactions
        Route::post('/transactions/income', [ApiTransactionController::class, 'storeIncome']);
        Route::post('/transactions/expense', [ApiTransactionController::class, 'storeExpense']);
        Route::post('/transactions/transfer', [ApiTransactionController::class, 'storeTransfer']);
        Route::get('/transactions', [ApiTransactionController::class, 'index']);
        Route::get('/transactions/{id}', [ApiTransactionController::class, 'show']);
        Route::delete('/transactions/{id}', [ApiTransactionController::class, 'destroy']);
    });
});

