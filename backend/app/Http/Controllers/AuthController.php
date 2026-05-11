<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    /**
     * Yeni kullanıcı kaydı
     */
    public function register(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users|ends_with:@gmail.com',
            'password' => 'required|string|min:8|confirmed',
        ], [
            'email.ends_with' => 'Güvenlik politikamız gereği sadece @gmail.com uzantılı mail adresleriyle kayıt olabilirsiniz.',
            'password.required' => 'Şifre alanı zorunludur.',
            'password.min' => 'Şifreniz en az 8 karakter uzunluğunda olmalıdır.',
            'password.confirmed' => 'Şifreler birbiriyle eşleşmiyor.',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $token = auth()->login($user);

        return response()->json([
            'message' => 'Kayıt başarılı',
            'user' => $user,
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60,
        ], 201);
    }

    /**
     * Kullanıcı girişi — JWT token döner
     */
    public function login(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $credentials = $request->only('email', 'password');

        if (!$token = auth()->attempt($credentials)) {
            return response()->json(['error' => 'E-posta veya şifre hatalı'], 401);
        }

        return response()->json([
            'message' => 'Giriş başarılı',
            'user' => auth()->user(),
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60,
        ]);
    }

    /**
     * Kullanıcı çıkışı — Token invalidate
     */
    public function logout(): JsonResponse
    {
        auth()->logout();

        return response()->json(['message' => 'Çıkış başarılı']);
    }

    /**
     * Mevcut kullanıcı bilgisi
     */
    public function me(): JsonResponse
    {
        return response()->json(auth()->user());
    }
}
