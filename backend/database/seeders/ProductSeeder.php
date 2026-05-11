<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            [
                'name' => 'iPhone 15 Pro',
                'description' => 'Apple iPhone 15 Pro 256GB Doğal Titanyum',
                'price' => 74999.00,
                'stock' => 25,
            ],
            [
                'name' => 'MacBook Air M3',
                'description' => 'Apple MacBook Air 13 inç M3 çip 8GB RAM 256GB SSD',
                'price' => 44999.00,
                'stock' => 15,
            ],
            [
                'name' => 'Samsung Galaxy S24 Ultra',
                'description' => 'Samsung Galaxy S24 Ultra 256GB Titanium Gray',
                'price' => 59999.00,
                'stock' => 30,
            ],
            [
                'name' => 'Sony WH-1000XM5',
                'description' => 'Sony WH-1000XM5 Kablosuz Gürültü Engelleyici Kulaklık',
                'price' => 12999.00,
                'stock' => 50,
            ],
            [
                'name' => 'iPad Air M2',
                'description' => 'Apple iPad Air 11 inç M2 çip 128GB Wi-Fi',
                'price' => 24999.00,
                'stock' => 20,
            ],
            [
                'name' => 'Logitech MX Master 3S',
                'description' => 'Logitech MX Master 3S Kablosuz Performans Mouse',
                'price' => 3499.00,
                'stock' => 100,
            ],
            [
                'name' => 'Dell UltraSharp U2723QE',
                'description' => 'Dell 27 inç 4K UHD USB-C Hub Monitör',
                'price' => 18999.00,
                'stock' => 10,
            ],
            [
                'name' => 'Mechanical Keyboard K8 Pro',
                'description' => 'Keychron K8 Pro QMK/VIA Kablosuz Mekanik Klavye',
                'price' => 4999.00,
                'stock' => 40,
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
