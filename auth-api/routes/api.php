<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;

Route::post('/user', [AuthController::class, 'createUser']);          // cria usuário
Route::get('/token', [AuthController::class, 'verifyToken']);        // verifica token
Route::post('/token', [AuthController::class, 'login']);             // gera token
Route::get('/user', [AuthController::class, 'getUserByEmail']);      // busca user por email
