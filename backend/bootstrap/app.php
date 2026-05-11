<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->api(prepend: [
            \Illuminate\Http\Middleware\HandleCors::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (\PHPOpenSourceSaver\JWTAuth\Exceptions\TokenExpiredException $e, Request $request) {
            return response()->json(['error' => 'Token süresi dolmuş'], 401);
        });
        $exceptions->render(function (\PHPOpenSourceSaver\JWTAuth\Exceptions\TokenInvalidException $e, Request $request) {
            return response()->json(['error' => 'Geçersiz token'], 401);
        });
        $exceptions->render(function (\PHPOpenSourceSaver\JWTAuth\Exceptions\JWTException $e, Request $request) {
            return response()->json(['error' => 'Token bulunamadı'], 401);
        });
    })->create();
