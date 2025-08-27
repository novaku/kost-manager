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
        Schema::create('rentals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('room_id')->constrained('rooms')->onDelete('cascade');
            $table->foreignId('tenant_id')->constrained('users')->onDelete('cascade');
            $table->date('start_date');
            $table->date('end_date');
            $table->decimal('monthly_rent', 10, 2); // Monthly rent amount (can differ from room price for discounts)
            $table->decimal('deposit_paid', 10, 2)->default(0);
            $table->enum('status', ['pending', 'active', 'expired', 'terminated', 'rejected'])->default('pending');
            $table->text('notes')->nullable();
            $table->json('terms_conditions')->nullable(); // Specific terms for this rental
            $table->timestamp('approved_at')->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('users');
            $table->timestamp('terminated_at')->nullable();
            $table->text('termination_reason')->nullable();
            $table->boolean('auto_renewal')->default(false);
            $table->integer('renewal_period_months')->default(1);
            $table->date('next_payment_due')->nullable();
            $table->timestamps();

            // Indexes for performance
            $table->index(['tenant_id', 'status']);
            $table->index(['room_id', 'status']);
            $table->index(['status', 'start_date', 'end_date']);
            $table->index('next_payment_due');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rentals');
    }
};
