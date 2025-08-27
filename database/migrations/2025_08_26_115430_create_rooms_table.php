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
        Schema::create('rooms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kostan_id')->constrained('kostans')->onDelete('cascade');
            $table->string('room_number');
            $table->text('description')->nullable();
            $table->decimal('monthly_price', 10, 2); // Monthly rental price
            $table->decimal('deposit_amount', 10, 2)->default(0); // Security deposit
            $table->decimal('size', 8, 2)->nullable(); // Room size in square meters
            $table->enum('status', ['available', 'occupied', 'maintenance', 'reserved'])->default('available');
            $table->json('facilities')->nullable(); // Room-specific facilities as JSON
            $table->json('images')->nullable(); // Room images as JSON
            $table->integer('floor')->nullable();
            $table->enum('room_type', ['single', 'shared', 'studio', 'apartment'])->default('single');
            $table->integer('max_occupancy')->default(1);
            $table->integer('current_occupancy')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamp('last_maintenance')->nullable();
            $table->timestamps();

            // Indexes for performance
            $table->index(['kostan_id', 'status']);
            $table->index(['status', 'is_active']);
            $table->index('monthly_price');
            $table->unique(['kostan_id', 'room_number']); // Unique room number per kostan
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rooms');
    }
};
