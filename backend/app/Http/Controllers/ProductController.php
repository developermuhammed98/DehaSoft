<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
    /**
     * Ürün listesi
     */
    public function index(): JsonResponse
    {
        $products = Product::all();
        return response()->json($products);
    }

    /**
     * Ürün detayı
     */
    public function show(int $id): JsonResponse
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json(['error' => 'Ürün bulunamadı'], 404);
        }

        return response()->json($product);
    }

    /**
     * Yeni ürün ekleme
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'image' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $product = Product::create($request->only(['name', 'description', 'price', 'stock', 'image']));

        return response()->json([
            'message' => 'Ürün oluşturuldu',
            'product' => $product,
        ], 201);
    }

    /**
     * Ürün güncelleme
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json(['error' => 'Ürün bulunamadı'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'price' => 'sometimes|numeric|min:0',
            'stock' => 'sometimes|integer|min:0',
            'image' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $product->update($request->only(['name', 'description', 'price', 'stock', 'image']));

        return response()->json([
            'message' => 'Ürün güncellendi',
            'product' => $product,
        ]);
    }

    /**
     * Ürün silme
     */
    public function destroy(int $id): JsonResponse
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json(['error' => 'Ürün bulunamadı'], 404);
        }

        $product->delete();

        return response()->json(['message' => 'Ürün silindi']);
    }
}
