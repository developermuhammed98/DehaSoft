<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    /**
     * Siparişleri listele
     */
    public function index(): JsonResponse
    {
        $orders = Order::where('user_id', auth()->id())
            ->with('items.product')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($orders);
    }

    /**
     * Tüm siparişleri listele (Admin)
     */
    public function adminIndex(): JsonResponse
    {
        $orders = Order::with(['items.product', 'user'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($orders);
    }

    /**
     * Sepetten sipariş oluştur
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'currency' => 'sometimes|string|in:TRY,USD,EUR',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $cart = Cart::where('user_id', auth()->id())->with('items.product')->first();

        if (!$cart || $cart->items->isEmpty()) {
            return response()->json(['error' => 'Sepetiniz boş'], 400);
        }

        // Stok kontrolü
        foreach ($cart->items as $item) {
            if ($item->product->stock < $item->quantity) {
                return response()->json([
                    'error' => "'{$item->product->name}' için yetersiz stok. Mevcut: {$item->product->stock}",
                ], 400);
            }
        }

        $currency = $request->currency ?? 'TRY';

        $rateValue = 1;
        if ($currency !== 'TRY') {
            $rate = \App\Models\ExchangeRate::where('currency', $currency)->orderBy('fetched_at', 'desc')->first();
            if ($rate) {
                $rateValue = $rate->rate;
            }
        }

        return DB::transaction(function () use ($cart, $currency, $rateValue) {
            $totalPrice = $cart->items->sum(function ($item) use ($rateValue) {
                return $item->quantity * ($item->product->price * $rateValue);
            });

            $order = Order::create([
                'user_id' => auth()->id(),
                'total_price' => $totalPrice,
                'currency' => $currency,
                'status' => 'pending',
            ]);

            foreach ($cart->items as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item->product_id,
                    'quantity' => $item->quantity,
                    'unit_price' => $item->product->price * $rateValue,
                ]);

                // Stok düş
                $item->product->decrement('stock', $item->quantity);
            }

            // Sepeti temizle
            $cart->items()->delete();

            $order->load('items.product');

            return response()->json([
                'message' => 'Sipariş oluşturuldu',
                'order' => $order,
            ], 201);
        });
    }

    /**
     * Sipariş detayı
     */
    public function show(int $id): JsonResponse
    {
        $order = Order::where('id', $id)
            ->where('user_id', auth()->id())
            ->with('items.product')
            ->first();

        if (!$order) {
            return response()->json(['error' => 'Sipariş bulunamadı'], 404);
        }

        return response()->json($order);
    }

    /**
     * Sipariş durumu güncelleme
     */
    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|string|in:pending,completed,cancelled',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $order = Order::find($id);

        if (!$order) {
            return response()->json(['error' => 'Sipariş bulunamadı'], 404);
        }

        $order->update(['status' => $request->status]);

        return response()->json([
            'message' => 'Sipariş durumu güncellendi',
            'order' => $order,
        ]);
    }
}
