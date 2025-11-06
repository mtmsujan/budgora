<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('currency', 3)->default('USD');
            $table->string('date_format', 20)->default('Y-m-d');
            $table->string('time_format', 10)->default('24'); // 12 or 24
            $table->string('first_day_of_week', 10)->default('monday'); // monday or sunday
            $table->boolean('notifications_enabled')->default(true);
            $table->string('language', 5)->default('en');
            $table->timestamps();

            $table->unique('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
