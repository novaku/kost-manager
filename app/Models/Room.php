<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Room extends Model
{
    use HasFactory;

    protected $fillable = [
        'kostan_id',
        'room_number',
        'description',
        'monthly_price',
        'deposit_amount',
        'size',
        'status',
        'facilities',
        'images',
        'floor',
        'room_type',
        'max_occupancy',
        'current_occupancy',
        'is_active',
        'last_maintenance',
    ];

    protected $casts = [
        'monthly_price' => 'decimal:2',
        'deposit_amount' => 'decimal:2',
        'size' => 'decimal:2',
        'facilities' => 'array',
        'images' => 'array',
        'is_active' => 'boolean',
        'last_maintenance' => 'datetime',
    ];

    // Relationships
    
    /**
     * Get the kostan this room belongs to
     */
    public function kostan()
    {
        return $this->belongsTo(Kostan::class);
    }

    /**
     * Get current rental for this room
     */
    public function currentRental()
    {
        return $this->hasOne(Rental::class)->where('status', 'active');
    }

    /**
     * Get all rentals for this room
     */
    public function rentals()
    {
        return $this->hasMany(Rental::class);
    }

    /**
     * Get current tenant
     */
    public function currentTenant()
    {
        $rental = $this->currentRental;
        return $rental ? $rental->tenant : null;
    }

    // Helper methods

    /**
     * Check if room is available
     */
    public function isAvailable(): bool
    {
        return $this->status === 'available' && $this->is_active;
    }

    /**
     * Check if room is occupied
     */
    public function isOccupied(): bool
    {
        return $this->status === 'occupied';
    }

    /**
     * Update room status based on occupancy
     */
    public function updateStatus()
    {
        if ($this->current_occupancy >= $this->max_occupancy) {
            $this->status = 'occupied';
        } elseif ($this->current_occupancy === 0) {
            $this->status = 'available';
        }
        $this->save();
    }

    /**
     * Get total price (monthly + deposit)
     */
    public function getTotalPrice(): float
    {
        return $this->monthly_price + $this->deposit_amount;
    }

    /**
     * Mark room as needing maintenance
     */
    public function markForMaintenance(string $reason = null)
    {
        $this->status = 'maintenance';
        $this->last_maintenance = now();
        $this->save();
    }
}
