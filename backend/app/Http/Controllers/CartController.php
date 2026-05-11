<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CartController extends Controller
{
    /**
     * Sepeti görüntüle
     */
    public function index(): JsonResponse
    {
        $cart = Cart::firstOrCreate(['user_id' => auth()->id()]);
        $cart->load('items.product');

        $total = $cart->items->sum(function ($item) {
            return $item->quantity * $item->product->price;
        });

        return response()->json([
            'cart' => $cart,
            'total' => number_format($total, 2, '.', ''),
        ]);
    }

    /**
     * Sepete ürün ekle
     */
    public function addItem(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|exists:products,id',
            'quantity' => 'sometimes|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $product = Product::find($request->product_id);
        $quantity = $request->quantity ?? 1;

        if ($product->stock < $quantity) {
            return response()->json(['error' => 'Yetersiz stok'], 400);
        }

        $cart = Cart::firstOrCreate(['user_id' => auth()->id()]);

        $cartItem = CartItem::where('cart_id', $cart->id)
            ->where('product_id', $request->product_id)
            ->first();

        if ($cartItem) {
            $cartItem->update(['quantity' => $cartItem->quantity + $quantity]);
        } else {
            $cartItem = CartItem::create([
                'cart_id' => $cart->id,
                'product_id' => $request->product_id,
                'quantity' => $quantity,
            ]);
        }

        $cartItem->load('product');

        return response()->json([
            'message' => 'Ürün sepete eklendi',
            'item' => $cartItem,
        ], 201);
    }

    /**
     * Sepet öğesi miktarını güncelle
     */
    public function updateItem(Request $request, int $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'quantity' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $cart = Cart::where('user_id', auth()->id())->first();

        if (!$cart) {
            return response()->json(['error' => 'Sepet bulunamadı'], 404);
        }

        $cartItem = CartItem::where('id', $id)->where('cart_id', $cart->id)->first();

        if (!$cartItem) {
            return response()->json(['error' => 'Sepet öğesi bulunamadı'], 404);
        }

        if ($cartItem->product->stock < $request->quantity) {
            return response()->json(['error' => 'Yetersiz stok'], 400);
        }

        $cartItem->update(['quantity' => $request->quantity]);
        $cartItem->load('product');

        return response()->json([
            'message' => 'Miktar güncellendi',
            'item' => $cartItem,
        ]);
    }

    /**
     * Sepetten ürün çıkar
     */
    public function removeItem(int $id): JsonResponse
    {
        $cart = Cart::where('user_id', auth()->id())->first();

        if (!$cart) {
            return response()->json(['error' => 'Sepet bulunamadı'], 404);
        }

        $cartItem = CartItem::where('id', $id)->where('cart_id', $cart->id)->first();

        if (!$cartItem) {
            return response()->json(['error' => 'Sepet öğesi bulunamadı'], 404);
        }

        $cartItem->delete();

        return response()->json(['message' => 'Ürün sepetten çıkarıldı']);
    }
}
