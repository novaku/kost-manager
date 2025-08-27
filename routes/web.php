<?php

use Illuminate\Support\Facades\Route;

// Serve the React app for the root route
Route::get('/', function () {
    return view('welcome');
});

// Catch-all route to support React Router (client-side routing)
// This ensures that routes like /login, /dashboard, etc. work when accessed directly
Route::get('/{path}', function () {
    return view('welcome');
})->where('path', '.*');
