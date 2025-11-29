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
            // Try to add the foreign key constraint
            // If it already exists, catch the exception and continue
            try {
                Schema::table('accounts', function (Blueprint $table) {
                    $table->foreign('group_id')->references('id')->on('account_groups')->onDelete('set null');
                });
            } catch (\Illuminate\Database\QueryException $e) {
                // Check if the error is about the constraint already existing
                $errorCode = $e->getCode();
                $errorMessage = $e->getMessage();
                
                // MySQL error codes: 1022 (Duplicate key name), 1061 (Duplicate key name)
                // PostgreSQL error codes: 42710 (duplicate_object)
                // SQLite: constraint already exists
                if ($errorCode == 1022 || $errorCode == 1061 || 
                    str_contains($errorMessage, 'already exists') || 
                    str_contains($errorMessage, 'duplicate') ||
                    str_contains($errorMessage, 'Duplicate key') ||
                    str_contains($errorMessage, 'duplicate_object')) {
                    // Foreign key already exists, which is fine - continue
                    return;
                }
                
                // Re-throw if it's a different error
                throw $e;
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
