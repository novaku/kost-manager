<?php

namespace Database\Factories;

use App\Models\Review;
use App\Models\Kostan;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Review>
 */
class ReviewFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $positiveReviews = [
            'Tempat bersih dan nyaman untuk tinggal',
            'Fasilitas lengkap dan terawat dengan baik',
            'Lokasi strategis dekat kampus dan transportasi umum',
            'Pemilik ramah dan responsif',
            'Keamanan 24 jam membuat tenang',
            'WiFi cepat dan stabil',
            'Kamar mandi bersih dan air lancar',
            'Suasana kost seperti keluarga',
            'Parkir luas dan aman',
            'Harga sesuai dengan fasilitas yang didapat'
        ];

        $neutralReviews = [
            'Secara keseluruhan cukup baik untuk harga segini',
            'Ada beberapa hal yang bisa diperbaiki tapi overall ok',
            'Standar kostan pada umumnya',
            'Sesuai ekspektasi untuk kostan di area ini'
        ];

        $negativeReviews = [
            'Perlu perbaikan di beberapa fasilitas',
            'Kadang air tidak lancar di jam tertentu',
            'Parkir agak sempit untuk motor',
            'WiFi kadang lemot di jam sibuk',
            'Suara bising dari jalan raya'
        ];

        $rating = fake()->numberBetween(1, 5);
        
        if ($rating >= 4) {
            $reviewText = fake()->randomElement($positiveReviews);
        } elseif ($rating >= 3) {
            $reviewText = fake()->randomElement($neutralReviews);
        } else {
            $reviewText = fake()->randomElement($negativeReviews);
        }

        return [
            'kostan_id' => Kostan::factory(),
            'tenant_id' => User::factory(),
            'rental_id' => null,
            'rating' => $rating,
            'comment' => $reviewText,
            'rating_details' => [
                'cleanliness' => $rating,
                'security' => $rating,
                'facilities' => $rating,
                'location' => $rating,
                'value_for_money' => $rating,
            ],
            'is_verified' => fake()->boolean(80),
            'is_published' => fake()->boolean(90),
            'published_at' => fake()->optional(0.9)->dateTimeBetween('-1 month', 'now'),
        ];
    }

    /**
     * Indicate that the review has a high rating.
     */
    public function positive(): static
    {
        return $this->state(fn (array $attributes) => [
            'rating' => fake()->numberBetween(4, 5),
            'comment' => fake()->randomElement([
                'Tempat bersih dan nyaman untuk tinggal',
                'Fasilitas lengkap dan terawat dengan baik',
                'Lokasi strategis dekat kampus dan transportasi umum',
                'Pemilik ramah dan responsif',
                'Keamanan 24 jam membuat tenang'
            ]),
        ]);
    }

    /**
     * Indicate that the review has a low rating.
     */
    public function negative(): static
    {
        return $this->state(fn (array $attributes) => [
            'rating' => fake()->numberBetween(1, 2),
            'comment' => fake()->randomElement([
                'Perlu perbaikan di beberapa fasilitas',
                'Kadang air tidak lancar di jam tertentu',
                'Parkir agak sempit untuk motor',
                'WiFi kadang lemot di jam sibuk'
            ]),
        ]);
    }

    /**
     * Indicate that the review is published.
     */
    public function approved(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_published' => true,
            'published_at' => fake()->dateTimeBetween('-1 month', 'now'),
        ]);
    }

    /**
     * Indicate that the review is pending.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_published' => false,
            'published_at' => null,
        ]);
    }

    /**
     * For specific kostan and tenant.
     */
    public function forKostanAndTenant(Kostan $kostan, User $tenant): static
    {
        return $this->state(fn (array $attributes) => [
            'kostan_id' => $kostan->id,
            'tenant_id' => $tenant->id,
        ]);
    }
}
