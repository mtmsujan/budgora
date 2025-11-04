<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Auth\ApiAuthController;
use App\Http\Controllers\Api\AccountController as ApiAccountController;
use App\Http\Controllers\Api\AccountGroupController as ApiAccountGroupController;
use App\Http\Controllers\Api\CategoryController as ApiCategoryController;
use App\Http\Controllers\Api\TransactionController as ApiTransactionController;
use App\Http\Controllers\Api\DashboardController as ApiDashboardController;

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
        
        // Accounts
        Route::apiResource('accounts', ApiAccountController::class);
        
        // Account Groups
        Route::apiResource('account-groups', ApiAccountGroupController::class);
        
        // Categories
        Route::apiResource('categories', ApiCategoryController::class);
        
        // Transactions
        Route::post('/transactions/income', [ApiTransactionController::class, 'storeIncome']);
        Route::post('/transactions/expense', [ApiTransactionController::class, 'storeExpense']);
        Route::post('/transactions/transfer', [ApiTransactionController::class, 'storeTransfer']);
        Route::get('/transactions', [ApiTransactionController::class, 'index']);
        Route::get('/transactions/{id}', [ApiTransactionController::class, 'show']);
        Route::delete('/transactions/{id}', [ApiTransactionController::class, 'destroy']);
    });
});

