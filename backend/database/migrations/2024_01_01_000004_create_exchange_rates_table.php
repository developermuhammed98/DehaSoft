<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('exchange_rates', function (Blueprint $table) {
            $table->id();
            $table->string('currency', 3); // USD, EUR
            $table->decimal('rate', 12, 6); // 1 birim = X TRY
            $table->timestamp('fetched_at');
            $table->timestamps();

            $table->index('currency');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('exchange_rates');
    }
};
