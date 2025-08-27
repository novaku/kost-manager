<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Carbon\Carbon;

class Rental extends Model
{
    use HasFactory;

    protected $fillable = [
        'room_id',
        'tenant_id',
        'start_date',
        'end_date',
        'monthly_rent',
        'deposit_paid',
        'status',
        'notes',
        'terms_conditions',
        'approved_at',
        'approved_by',
        'terminated_at',
        'termination_reason',
        'auto_renewal',
        'renewal_period_months',
        'next_payment_due',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'monthly_rent' => 'decimal:2',
        'deposit_paid' => 'decimal:2',
        'terms_conditions' => 'array',
        'approved_at' => 'datetime',
        'terminated_at' => 'datetime',
        'auto_renewal' => 'boolean',
        'next_payment_due' => 'date',
    ];

    // Relationships
    
    /**
     * Get the room being rented
     */
    public function room()
    {
        return $this->belongsTo(Room::class);
    }

    /**
     * Get the tenant
     */
    public function tenant()
    {
        return $this->belongsTo(User::class, 'tenant_id');
    }

    /**
     * Get the user who approved this rental
     */
    public function approvedBy()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    /**
     * Get payments for this rental
     */
    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    /**
     * Get completed payments
     */
    public function completedPayments()
    {
        return $this->payments()->where('status', 'completed');
    }

    /**
     * Get pending payments
     */
    public function pendingPayments()
    {
        return $this->payments()->whereIn('status', ['pending', 'processing']);
    }

    // Helper methods

    /**
     * Check if rental is active
     */
    public function isActive(): bool
    {
        return $this->status === 'active' && 
               $this->start_date <= now() && 
               $this->end_date >= now();
    }

    /**
     * Check if rental is expired
     */
    public function isExpired(): bool
    {
        return $this->end_date < now()->toDateString();
    }

    /**
     * Get days remaining in rental
     */
    public function getDaysRemaining(): int
    {
        if ($this->isExpired()) return 0;
        return Carbon::parse($this->end_date)->diffInDays(now());
    }

    /**
     * Generate next payment due date
     */
    public function generateNextPaymentDue(): void
    {
        if ($this->next_payment_due) {
            $this->setAttribute('next_payment_due', Carbon::parse($this->next_payment_due)->addMonth());
        } else {
            $this->setAttribute('next_payment_due', Carbon::parse($this->start_date)->addMonth());
        }
        $this->save();
    }

    /**
     * Check if payment is overdue
     */
    public function isPaymentOverdue(): bool
    {
        return $this->next_payment_due && 
               $this->next_payment_due < now()->toDateString();
    }

    /**
     * Get the kostan through the room relationship
     */
    public function kostan()
    {
        return $this->hasOneThrough(Kostan::class, Room::class, 'id', 'id', 'room_id', 'kostan_id');
    }

    /**
     * Check if rental can be renewed
     */
    public function canBeRenewed(): bool
    {
        return $this->status === 'active' && 
               $this->auto_renewal && 
               $this->renewal_period_months > 0;
    }

    /**
     * Approve rental
     */
    public function approve(User $approver): void
    {
        $this->status = 'active';
        $this->approved_at = now();
        $this->approved_by = $approver->id;
        $this->generateNextPaymentDue();
        $this->save();

        // Update room status
        if ($this->room) {
            $this->room->current_occupancy++;
            $this->room->updateStatus();
        }
    }

    /**
     * Terminate rental
     */
    public function terminate(string $reason = null): void
    {
        $this->status = 'terminated';
        $this->terminated_at = now();
        $this->termination_reason = $reason;
        $this->save();

        // Update room status
        if ($this->room) {
            $this->room->current_occupancy = max(0, $this->room->current_occupancy - 1);
            $this->room->updateStatus();
        }
    }

    /**
     * Calculate total amount paid
     */
    public function getTotalPaid(): float
    {
        return $this->completedPayments()->sum('amount');
    }

    /**
     * Auto-renew rental if enabled
     */
    public function autoRenew(): void
    {
        if (!$this->canBeRenewed() || !$this->isExpired()) return;

        $this->setAttribute('end_date', Carbon::parse($this->end_date)->addMonths($this->renewal_period_months));
        $this->save();
    }
}
