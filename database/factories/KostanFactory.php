<?php

namespace Database\Factories;

use App\Models\Kostan;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Kostan>
 */
class KostanFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $cities = ['Jakarta', 'Bandung', 'Surabaya', 'Yogyakarta', 'Semarang', 'Malang', 'Solo', 'Denpasar'];
        $provinces = ['DKI Jakarta', 'Jawa Barat', 'Jawa Timur', 'DI Yogyakarta', 'Jawa Tengah', 'Bali'];
        
        $facilities = [
            'WiFi',
            'AC',
            'Kamar Mandi Dalam',
            'Dapur Bersama',
            'Parkir Motor',
            'Parkir Mobil',
            'Laundry',
            'Security 24 Jam',
            'CCTV',
            'Musholla',
            'Ruang Tamu',
            'Kulkas Bersama',
            'Dispenser',
            'TV Bersama'
        ];

        $rules = [
            'Dilarang merokok di dalam kamar',
            'Jam malam 22:00 WIB',
            'Tamu maksimal sampai jam 21:00',
            'Dilarang membawa hewan peliharaan',
            'Jaga kebersihan kamar dan area umum',
            'Bayar sewa tepat waktu',
            'Lapor jika ada kerusakan',
            'Hormati penghuni lain'
        ];

        return [
            'owner_id' => User::factory(),
            'name' => 'Kost ' . fake()->streetName(),
            'description' => fake()->paragraph(3),
            'address' => fake()->address(),
            'city' => fake()->randomElement($cities),
            'province' => fake()->randomElement($provinces),
            'postal_code' => fake()->postcode(),
            'latitude' => fake()->latitude(-6.2, -6.1), // Jakarta area
            'longitude' => fake()->longitude(106.8, 106.9),
            'facilities' => fake()->randomElements($facilities, rand(6, 10)),
            'rules' => fake()->randomElements($rules, rand(4, 6)),
            'images' => [
                'https://via.placeholder.com/800x600/cccccc/969696?text=Kost+Exterior',
                'https://via.placeholder.com/800x600/dddddd/aaaaaa?text=Common+Area',
                'https://via.placeholder.com/800x600/eeeeee/bbbbbb?text=Facilities'
            ],
            'is_active' => true,
            'total_rooms' => rand(10, 30),
            'average_rating' => fake()->randomFloat(1, 3.5, 5.0),
            'total_reviews' => rand(5, 50),
        ];
    }

    /**
     * Indicate that the kostan is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }

    /**
     * Indicate that the kostan is for a specific owner.
     */
    public function forOwner(User $owner): static
    {
        return $this->state(fn (array $attributes) => [
            'owner_id' => $owner->id,
        ]);
    }
}
