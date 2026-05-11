<?php

namespace App\Http\Controllers;

use App\Models\ExchangeRate;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Http;

class ExchangeRateController extends Controller
{
    /**
     * Güncel döviz kurlarını getir
     */
    public function index(): JsonResponse
    {
        // Son 1 dakika içinde çekilmiş mi kontrol et (Anlık olması için süreyi minimumda tutuyoruz)
        $latestRate = ExchangeRate::where('currency', 'USD')
            ->where('fetched_at', '>=', now()->subMinute())
            ->first();

        if (!$latestRate) {
            $this->fetchAndStoreRates();
        }

        $rates = ExchangeRate::whereIn('currency', ['USD', 'EUR'])
            ->orderBy('fetched_at', 'desc')
            ->get()
            ->unique('currency');

        return response()->json([
            'base' => 'TRY',
            'rates' => $rates->mapWithKeys(function ($rate) {
                return [$rate->currency => $rate->rate];
            }),
            'fetched_at' => $rates->first()?->fetched_at,
        ]);
    }

    /**
     * Harici API'den kurları çek ve DB'ye kaydet
     */
    private function fetchAndStoreRates(): void
    {
        try {
            $response = Http::withoutVerifying()->get('https://api.exchangerate-api.com/v4/latest/TRY');

            if ($response->successful()) {
                $data = $response->json();

                foreach (['USD', 'EUR'] as $currency) {
                    if (isset($data['rates'][$currency])) {
                        ExchangeRate::updateOrCreate(
                            ['currency' => $currency],
                            [
                                'rate' => $data['rates'][$currency],
                                'fetched_at' => now(),
                            ]
                        );
                    }
                }
            }
        } catch (\Exception $e) {
            // API erişilemez ise sessizce devam et
            // Eski kurlar kullanılır
        }
    }
}
