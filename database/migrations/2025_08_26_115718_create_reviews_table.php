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
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kostan_id')->constrained('kostans')->onDelete('cascade');
            $table->foreignId('tenant_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('rental_id')->nullable()->constrained('rentals')->onDelete('set null');
            $table->integer('rating')->check('rating >= 1 AND rating <= 5');
            $table->text('comment')->nullable();
            $table->json('rating_details')->nullable(); // Detailed ratings (cleanliness, location, etc.)
            $table->boolean('is_verified')->default(false); // Only verified tenants can review
            $table->boolean('is_published')->default(true);
            $table->timestamp('published_at')->nullable();
            $table->timestamps();

            // Indexes for performance
            $table->index(['kostan_id', 'is_published']);
            $table->index(['tenant_id', 'is_published']);
            $table->index('rating');
            $table->unique(['kostan_id', 'tenant_id']); // One review per tenant per kostan
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
