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
        // Check if table already exists (may have been created by add_group_id migration)
        if (!Schema::hasTable('account_groups')) {
            Schema::create('account_groups', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained()->onDelete('cascade');
                $table->string('name');
                $table->string('color')->nullable();
                $table->integer('order')->default(0);
                $table->timestamps();
            });
        } else {
            // Table exists, but check if 'order' column exists (it might have been created without it)
            if (!Schema::hasColumn('account_groups', 'order')) {
                Schema::table('account_groups', function (Blueprint $table) {
                    $table->integer('order')->default(0)->after('color');
                });
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('account_groups');
    }
};
