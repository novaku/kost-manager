<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Review extends Model
{
    use HasFactory;

    protected $fillable = [
        'kostan_id',
        'tenant_id',
        'rental_id',
        'rating',
        'comment',
        'rating_details',
        'is_verified',
        'is_published',
        'published_at',
    ];

    protected $casts = [
        'rating_details' => 'array',
        'is_verified' => 'boolean',
        'is_published' => 'boolean',
        'published_at' => 'datetime',
    ];

    // Relationships
    
    /**
     * Get the kostan being reviewed
     */
    public function kostan()
    {
        return $this->belongsTo(Kostan::class);
    }

    /**
     * Get the tenant who wrote the review
     */
    public function tenant()
    {
        return $this->belongsTo(User::class, 'tenant_id');
    }

    /**
     * Get the rental associated with this review
     */
    public function rental()
    {
        return $this->belongsTo(Rental::class);
    }

    // Helper methods

    /**
     * Publish the review
     */
    public function publish(): void
    {
        $this->is_published = true;
        $this->published_at = now();
        $this->save();

        // Update kostan average rating
        $this->kostan->updateAverageRating();
    }

    /**
     * Unpublish the review
     */
    public function unpublish(): void
    {
        $this->is_published = false;
        $this->published_at = null;
        $this->save();

        // Update kostan average rating
        $this->kostan->updateAverageRating();
    }

    /**
     * Verify the review
     */
    public function verify(): void
    {
        $this->is_verified = true;
        $this->save();
    }

    /**
     * Get star rating as filled/empty array
     */
    public function getStarArray(): array
    {
        $stars = [];
        for ($i = 1; $i <= 5; $i++) {
            $stars[] = $i <= $this->rating;
        }
        return $stars;
    }
}
