<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Kostan extends Model
{
    use HasFactory;

    protected $fillable = [
        'owner_id',
        'name',
        'description',
        'address',
        'city',
        'province',
        'postal_code',
        'latitude',
        'longitude',
        'facilities',
        'rules',
        'images',
        'is_active',
        'total_rooms',
        'average_rating',
        'total_reviews',
    ];

    protected $casts = [
        'facilities' => 'array',
        'rules' => 'array',
        'images' => 'array',
        'is_active' => 'boolean',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'average_rating' => 'decimal:2',
    ];

    // Relationships
    
    /**
     * Get the owner of this kostan
     */
    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    /**
     * Get all rooms in this kostan
     */
    public function rooms()
    {
        return $this->hasMany(Room::class);
    }

    /**
     * Get available rooms in this kostan
     */
    public function availableRooms()
    {
        return $this->rooms()->where('status', 'available')->where('is_active', true);
    }

    /**
     * Get reviews for this kostan
     */
    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    /**
     * Get published reviews for this kostan
     */
    public function publishedReviews()
    {
        return $this->reviews()->where('is_published', true);
    }

    // Helper methods

    /**
     * Update total rooms count
     */
    public function updateTotalRooms()
    {
        $this->total_rooms = $this->rooms()->count();
        $this->save();
    }

    /**
     * Update average rating
     */
    public function updateAverageRating()
    {
        $reviews = $this->publishedReviews();
        $this->average_rating = $reviews->avg('rating') ?? 0;
        $this->total_reviews = $reviews->count();
        $this->save();
    }

    /**
     * Get occupancy rate
     */
    public function getOccupancyRate(): float
    {
        $totalRooms = $this->rooms()->count();
        if ($totalRooms === 0) return 0;
        
        $occupiedRooms = $this->rooms()->where('status', 'occupied')->count();
        return ($occupiedRooms / $totalRooms) * 100;
    }

    /**
     * Get monthly revenue
     */
    public function getMonthlyRevenue(): float
    {
        return $this->rooms()
            ->where('status', 'occupied')
            ->sum('monthly_price');
    }
}
