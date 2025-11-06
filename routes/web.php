<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FrontendController;



Route::fallback([FrontendController::class, 'react'])->middleware("verify.shopify");

Route::get('/', [FrontendController::class, 'react'])->middleware(['verify.shopify'])->name('home');

//GDPR Webhooks Routes
Route::post('/webhook/customers-data-request', function () {
    return response("Ok",200);
});

Route::post('/webhook/customers-redact', function () {
    return response("Ok",200);
});

Route::post('/webhook/shop-redact', function () {
    return response("Ok",200);
});