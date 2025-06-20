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
            'lastName' => 'required|string|max:100',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'lastName' => $validated['lastName'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        return response()->json([
            'message' => 'Usuário criado com sucesso',
            'user' => [
                'name' => $user->name,
                'lastName' => $user->lastName,
                'email' => $user->email,
            ]
        ]);
    }

    // PUT /api/user/{id} - atualizar usuário
    public function updateUser(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'Usuário não encontrado'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:100',
            'lastName' => 'sometimes|string|max:100',
            'email' => 'sometimes|email|unique:users,email,' . $id,
            'password' => 'sometimes|string|min:6',
        ]);

        if (isset($validated['name'])) {
            $user->name = $validated['name'];
        }
        if (isset($validated['lastName'])) {
            $user->lastName = $validated['lastName'];
        }
        if (isset($validated['email'])) {
            $user->email = $validated['email'];
        }
        if (isset($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        return response()->json([
            'message' => 'Usuário atualizado com sucesso',
            'user' => [
                'name' => $user->name,
                'lastName' => $user->lastName,
                'email' => $user->email,
            ],
        ]);
    }

    // DELETE /api/user/{id} - deletar usuário
    public function deleteUser($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'Usuário não encontrado'], 404);
        }

        $user->delete();

        return response()->json(['message' => 'Usuário deletado com sucesso']);
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
            return response()->json(['auth' => false], 401);
        }

        // remover "Bearer " do token
        if (str_starts_with($token, 'Bearer ')) {
            $token = substr($token, 7);
        }

        try {
            // verificar se o token é válido
            $payload = JWTAuth::setToken($token)->getPayload();

            // verificar se userId da query está no token e é igual ao esperado
            if ($payload->get('sub') != $userId) {
                return response()->json(['auth' => false]);
            }

            // buscar usuário no banco
            $user = User::find($userId);
            if (!$user) {
                return response()->json(['auth' => false]);
            }

            // Se chegou até aqui, token é válido para o usuário
            return response()->json(['auth' => true]);

        } catch (\Exception $e) {
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
            'lastName' => $user->lastName,
            'email' => $user->email,
        ]);
    }
}
