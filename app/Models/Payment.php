<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'rental_id',
        'tenant_id',
        'payment_reference',
        'amount',
        'payment_type',
        'status',
        'payment_method',
        'payment_gateway',
        'gateway_reference',
        'gateway_response',
        'payment_for_month',
        'due_date',
        'paid_at',
        'late_fee',
        'notes',
        'receipt_url',
        'is_auto_payment',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'late_fee' => 'decimal:2',
        'gateway_response' => 'array',
        'payment_for_month' => 'date',
        'due_date' => 'date',
        'paid_at' => 'datetime',
        'is_auto_payment' => 'boolean',
    ];

    // Relationships
    
    /**
     * Get the rental this payment belongs to
     */
    public function rental()
    {
        return $this->belongsTo(Rental::class);
    }

    /**
     * Get the tenant who made this payment
     */
    public function tenant()
    {
        return $this->belongsTo(User::class, 'tenant_id');
    }

    // Helper methods

    /**
     * Check if payment is completed
     */
    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    /**
     * Check if payment is pending
     */
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    /**
     * Check if payment is overdue
     */
    public function isOverdue(): bool
    {
        return $this->due_date < now()->toDateString() && !$this->isCompleted();
    }

    /**
     * Calculate days overdue
     */
    public function getDaysOverdue(): int
    {
        if (!$this->isOverdue()) return 0;
        return now()->diffInDays($this->due_date);
    }

    /**
     * Calculate late fee based on days overdue
     */
    public function calculateLateFee(float $dailyRate = 50000): float
    {
        $daysOverdue = $this->getDaysOverdue();
        return $daysOverdue * $dailyRate;
    }

    /**
     * Mark payment as completed
     */
    public function markAsCompleted(array $gatewayResponse = null): void
    {
        $this->status = 'completed';
        $this->paid_at = now();
        if ($gatewayResponse) {
            $this->gateway_response = $gatewayResponse;
        }
        $this->save();

        // Update rental next payment due
        $this->rental->generateNextPaymentDue();
    }

    /**
     * Mark payment as failed
     */
    public function markAsFailed(string $reason = null): void
    {
        $this->status = 'failed';
        if ($reason) {
            $this->notes = $reason;
        }
        $this->save();
    }

    /**
     * Generate unique payment reference
     */
    public static function generateReference(): string
    {
        $prefix = 'PAY';
        $timestamp = now()->format('Ymd');
        $random = strtoupper(substr(md5(uniqid()), 0, 6));
        return "{$prefix}{$timestamp}{$random}";
    }

    /**
     * Get total amount including late fee
     */
    public function getTotalAmount(): float
    {
        return $this->amount + $this->late_fee;
    }
}
