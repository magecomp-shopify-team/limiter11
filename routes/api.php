<?php

use App\Http\Controllers\PlanController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SessionController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\JsonController;
use App\Http\Controllers\DesignController;
use App\Http\Controllers\ProxyController;
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


Route::middleware(['verify.shopify'])->group(function () {
    Route::get('/settings', [SettingsController::class, 'getSettings']);
    Route::post('/settings', [SettingsController::class, 'setSettings']);
    Route::get('/get-rules', [JsonController::class, 'getRules']);
    Route::post('/save-rules', [JsonController::class, 'saveRules']);
    Route::post('/get-mobile-promo', [SessionController::class, 'getMobilePromo']);
    Route::post('/close-mobile-promo', [SessionController::class, 'closeMobilePromo']);
    Route::post('/get-app-status', [SessionController::class, 'getAppStatus']);
    Route::post('/design/save', [DesignController::class, 'saveDesign']);
    Route::post('/design/get', [DesignController::class, 'index']);
    Route::get('/plans/{plan}', [PlanController::class, 'index'])->name('billing.cus');
});

Route::post('/rulebase-proxy', [ProxyController::class, 'indexProxy']);

Route::get('/rulebase-proxy', [ProxyController::class, 'indexProxy']);