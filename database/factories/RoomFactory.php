<?php

namespace Database\Factories;

use App\Models\Room;
use App\Models\Kostan;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Room>
 */
class RoomFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $roomTypes = ['single', 'shared', 'studio', 'apartment'];
        $statuses = ['available', 'occupied', 'maintenance'];
        
        $facilities = [
            'Kasur',
            'Lemari',
            'Meja Belajar',
            'Kursi',
            'AC',
            'Kipas Angin',
            'Jendela',
            'Stop Kontak',
            'Lampu Baca',
            'Cermin',
            'Gantungan Baju',
            'WiFi'
        ];

        $roomType = fake()->randomElement($roomTypes);
        $basePrice = match($roomType) {
            'apartment' => 2000000,
            'studio' => 1500000,
            'single' => 1000000,
            'shared' => 800000,
            default => 1000000
        };
        $priceVariation = rand(-200000, 300000);

        return [
            'kostan_id' => Kostan::factory(),
            'room_number' => fake()->regexify('[A-C][0-9]{2}'),
            'description' => fake()->paragraph(2),
            'monthly_price' => $basePrice + $priceVariation,
            'deposit_amount' => ($basePrice + $priceVariation) * 1,
            'size' => fake()->randomFloat(1, 8.0, 20.0),
            'status' => fake()->randomElement($statuses),
            'facilities' => fake()->randomElements($facilities, rand(6, 10)),
            'images' => [
                'https://via.placeholder.com/800x600/f0f0f0/cccccc?text=Room+View',
                'https://via.placeholder.com/800x600/f5f5f5/dddddd?text=Room+Interior'
            ],
            'floor' => rand(1, 4),
            'room_type' => $roomType,
            'max_occupancy' => $roomType === 'shared' ? 2 : 1,
            'current_occupancy' => 0,
            'is_active' => true,
            'last_maintenance' => fake()->dateTimeBetween('-3 months', 'now'),
        ];
    }

    /**
     * Indicate that the room is occupied.
     */
    public function occupied(): static
    {
        return $this->state(function (array $attributes) {
            $maxOccupancy = $attributes['max_occupancy'] ?? 1;
            return [
                'status' => 'occupied',
                'current_occupancy' => $maxOccupancy,
            ];
        });
    }

    /**
     * Indicate that the room is available.
     */
    public function available(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'available',
            'current_occupancy' => 0,
        ]);
    }

    /**
     * Indicate that the room is under maintenance.
     */
    public function maintenance(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'maintenance',
            'current_occupancy' => 0,
        ]);
    }

    /**
     * Indicate that the room belongs to a specific kostan.
     */
    public function forKostan(Kostan $kostan): static
    {
        return $this->state(fn (array $attributes) => [
            'kostan_id' => $kostan->id,
        ]);
    }
}
