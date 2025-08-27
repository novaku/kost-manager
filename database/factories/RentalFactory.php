<?php

namespace Database\Factories;

use App\Models\Rental;
use App\Models\Room;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Rental>
 */
class RentalFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $statuses = ['active', 'pending', 'expired', 'terminated'];
        $status = fake()->randomElement($statuses);
        
        $startDate = fake()->dateTimeBetween('-1 year', 'now');
        $endDate = (clone $startDate)->modify('+12 months');
        
        $monthlyRent = fake()->numberBetween(800000, 2000000);
        
        $terms = [
            'Pembayaran dilakukan setiap tanggal 1',
            'Deposit dikembalikan setelah check-out',
            'Kerusakan fasilitas menjadi tanggung jawab penyewa',
            'Kontrak minimal 3 bulan',
            'Pemberitahuan keluar H-30',
        ];

        return [
            'room_id' => Room::factory(),
            'tenant_id' => User::factory(),
            'start_date' => $startDate,
            'end_date' => $endDate,
            'monthly_rent' => $monthlyRent,
            'deposit_paid' => $monthlyRent,
            'status' => $status,
            'notes' => fake()->paragraph(),
            'terms_conditions' => fake()->randomElements($terms, rand(3, 5)),
            'approved_at' => $status !== 'pending' && $startDate <= now() ? fake()->dateTimeBetween($startDate, 'now') : null,
            'approved_by' => $status !== 'pending' ? 1 : null,
            'terminated_at' => $status === 'terminated' && $startDate <= now() ? fake()->dateTimeBetween($startDate, 'now') : null,
            'termination_reason' => $status === 'terminated' ? fake()->randomElement([
                'Pindah kerja',
                'Melanggar aturan',
                'Permintaan sendiri',
                'Tidak bayar sewa'
            ]) : null,
            'auto_renewal' => fake()->boolean(70),
            'renewal_period_months' => 12,
            'next_payment_due' => $status === 'active' ? fake()->dateTimeBetween('now', '+1 month') : null,
        ];
    }

    /**
     * Indicate that the rental is active.
     */
    public function active(): static
    {
        return $this->state(function (array $attributes) {
            $startDate = fake()->dateTimeBetween('-6 months', '-1 month');
            $endDate = (clone $startDate)->modify('+12 months');
            
            return [
                'status' => 'active',
                'start_date' => $startDate,
                'end_date' => $endDate,
                'approved_at' => $startDate,
                'approved_by' => 1,
                'next_payment_due' => fake()->dateTimeBetween('now', '+1 month'),
            ];
        });
    }

    /**
     * Indicate that the rental is pending approval.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
            'approved_at' => null,
            'approved_by' => null,
            'next_payment_due' => null,
        ]);
    }

    /**
     * Indicate that the rental is expired.
     */
    public function expired(): static
    {
        return $this->state(function (array $attributes) {
            $startDate = fake()->dateTimeBetween('-2 years', '-1 year');
            $endDate = (clone $startDate)->modify('+6 months');
            
            return [
                'status' => 'expired',
                'start_date' => $startDate,
                'end_date' => $endDate,
                'approved_at' => $startDate,
                'approved_by' => 1,
                'next_payment_due' => null,
            ];
        });
    }

    /**
     * For specific room and tenant.
     */
    public function forRoomAndTenant(Room $room, User $tenant): static
    {
        return $this->state(fn (array $attributes) => [
            'room_id' => $room->id,
            'tenant_id' => $tenant->id,
            'monthly_rent' => $room->monthly_price,
            'deposit_paid' => $room->deposit_amount,
        ]);
    }
}
