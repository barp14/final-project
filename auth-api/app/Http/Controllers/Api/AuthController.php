<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class AuthController extends Controller
{
    // POST /api/user - criar usuário
    public function createUser(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'last_name' => $validated['last_name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        return response()->json([
            'message' => 'Usuário criado com sucesso',
            'user' => [
                'name' => $user->name,
                'last_name' => $user->last_name,
                'email' => $user->email,
            ]
        ]);
    }

    // POST /api/token - login e geração de token JWT
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        $user = User::where('email', $credentials['email'])->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return response()->json(['token' => false], 401);
        }

        // Gera token só com userId (não inclui senha)
        $payload = [
            'userId' => $user->id,
        ];

        $token = JWTAuth::fromUser($user, $payload);

        return response()->json(['token' => $token]);
    }

    // GET /api/token?user=userId - autenticar token JWT
    public function verifyToken(Request $request)
    {
        $token = $request->header('Authorization');
        $userId = $request->query('user');

        if (!$token) {
            return response()->json(['auth' => false]);
        }

        try {
            $payload = JWTAuth::setToken($token)->getPayload();

            $userObject = User::find($userId);
            if (!$userObject) {
                return response()->json(['auth' => false]);
            }

            if ($payload->get('userId') == $userObject->id) {
                return response()->json(['auth' => true]);
            }

            return response()->json(['auth' => false]);
        } catch (JWTException $e) {
            return response()->json(['auth' => false]);
        }
    }

    // GET /api/user?email=... - busca usuário pelo email (query string)
    public function getUserByEmail(Request $request)
    {
        $email = $request->query('email');

        $user = User::where('email', $email)->first();

        if (!$user) {
            return response()->json(null, 404);
        }

        return response()->json([
            'name' => $user->name,
            'last_name' => $user->last_name,
            'email' => $user->email,
        ]);
    }
}
