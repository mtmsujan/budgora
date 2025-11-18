<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Ensure account_groups table exists before adding foreign key
        if (!Schema::hasTable('account_groups')) {
            // If account_groups doesn't exist, create it first
            Schema::create('account_groups', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained()->onDelete('cascade');
                $table->string('name');
                $table->string('color')->nullable();
                $table->integer('order')->default(0);
                $table->timestamps();
            });
        }

        Schema::table('accounts', function (Blueprint $table) {
            if (!Schema::hasColumn('accounts', 'group_id')) {
                // Add the column first
                $table->foreignId('group_id')->nullable()->after('user_id');
            }
        });

        // Add foreign key constraint separately (in case column exists but constraint doesn't)
        if (Schema::hasTable('account_groups') && Schema::hasColumn('accounts', 'group_id')) {
            // Check if foreign key already exists
            $foreignKeys = DB::select(
                "SELECT CONSTRAINT_NAME 
                 FROM information_schema.KEY_COLUMN_USAGE 
                 WHERE TABLE_SCHEMA = DATABASE() 
                 AND TABLE_NAME = 'accounts' 
                 AND COLUMN_NAME = 'group_id' 
                 AND REFERENCED_TABLE_NAME IS NOT NULL"
            );

            if (empty($foreignKeys)) {
                Schema::table('accounts', function (Blueprint $table) {
                    $table->foreign('group_id')->references('id')->on('account_groups')->onDelete('set null');
                });
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('accounts', function (Blueprint $table) {
            $table->dropForeign(['group_id']);
            $table->dropColumn('group_id');
        });
    }
};
