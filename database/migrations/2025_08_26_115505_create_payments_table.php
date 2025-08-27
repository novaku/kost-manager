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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('rental_id')->constrained('rentals')->onDelete('cascade');
            $table->foreignId('tenant_id')->constrained('users')->onDelete('cascade');
            $table->string('payment_reference')->unique(); // Unique payment reference
            $table->decimal('amount', 10, 2);
            $table->enum('payment_type', ['monthly_rent', 'deposit', 'late_fee', 'utility', 'other']);
            $table->enum('status', ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'])->default('pending');
            $table->enum('payment_method', ['bank_transfer', 'e_wallet', 'credit_card', 'cash', 'virtual_account']);
            $table->string('payment_gateway')->nullable(); // midtrans, xendit, etc
            $table->string('gateway_reference')->nullable(); // Reference from payment gateway
            $table->json('gateway_response')->nullable(); // Full response from payment gateway
            $table->date('payment_for_month'); // Which month this payment is for
            $table->date('due_date');
            $table->timestamp('paid_at')->nullable();
            $table->decimal('late_fee', 10, 2)->default(0);
            $table->text('notes')->nullable();
            $table->string('receipt_url')->nullable(); // URL to payment receipt
            $table->boolean('is_auto_payment')->default(false);
            $table->timestamps();

            // Indexes for performance
            $table->index(['rental_id', 'status']);
            $table->index(['tenant_id', 'status']);
            $table->index(['status', 'due_date']);
            $table->index(['payment_for_month', 'rental_id']);
            $table->index('payment_reference');
            $table->index('gateway_reference');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
