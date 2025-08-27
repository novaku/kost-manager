<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\KostanController;
use App\Http\Controllers\Api\RoomController;
use App\Http\Controllers\Api\RentalController;
use App\Http\Controllers\Api\PaymentController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Telegram webhook
Route::post('/telegram/webhook', [App\Http\Controllers\TelegramWebhookController::class, 'handle']);

// Public kostans routes (for browsing)
Route::get('/kostans', [KostanController::class, 'index']);
Route::get('/kostans/{kostan}', [KostanController::class, 'show']);
Route::get('/kostans/{kostan}/rooms', [RoomController::class, 'index']);
Route::get('/rooms/{room}', [RoomController::class, 'show']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Authentication routes
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/logout-all', [AuthController::class, 'logoutAll']);

    // Owner routes
    Route::middleware('role:owner')->group(function () {
        Route::apiResource('kostans', KostanController::class)->except(['index', 'show']);
        Route::apiResource('kostans.rooms', RoomController::class)->except(['index', 'show']);
        Route::get('/my-kostans', [KostanController::class, 'myKostans']);
        Route::get('/rentals/applications', [RentalController::class, 'applications']);
        Route::post('/rentals/{rental}/approve', [RentalController::class, 'approve']);
        Route::post('/rentals/{rental}/reject', [RentalController::class, 'reject']);
    });

    // Tenant routes
    Route::middleware('role:tenant')->group(function () {
        Route::post('/rentals/apply', [RentalController::class, 'apply']);
        Route::get('/my-rentals', [RentalController::class, 'myRentals']);
        Route::get('/my-payments', [PaymentController::class, 'myPayments']);
    });

    // Common routes for both roles
    Route::apiResource('rentals', RentalController::class)->only(['index', 'show']);
    Route::apiResource('payments', PaymentController::class)->only(['index', 'show', 'store']);
    
    // Payment routes
    Route::post('/payments/{payment}/process', [PaymentController::class, 'process']);
    Route::post('/payments/webhook', [PaymentController::class, 'webhook']);
});

// Health check
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now(),
        'version' => config('app.version', '1.0.0')
    ]);
});
