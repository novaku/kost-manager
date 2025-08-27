<?php

namespace Database\Factories;

use App\Models\Payment;
use App\Models\Rental;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Payment>
 */
class PaymentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $statuses = ['completed', 'pending', 'failed', 'cancelled'];
        $paymentTypes = ['monthly_rent', 'deposit', 'late_fee', 'utility', 'other'];
        $paymentMethods = ['bank_transfer', 'e_wallet', 'cash', 'credit_card'];
        $gateways = ['midtrans', 'xendit', 'gopay', 'ovo', 'dana'];
        
        $status = fake()->randomElement($statuses);
        $amount = fake()->numberBetween(800000, 2000000);
        $paymentType = fake()->randomElement($paymentTypes);
        
        $paymentForMonth = fake()->dateTimeBetween('-6 months', 'now');
        $dueDate = (clone $paymentForMonth)->modify('first day of this month');
        
        return [
            'rental_id' => Rental::factory(),
            'tenant_id' => User::factory(),
            'payment_reference' => 'PAY-' . fake()->regexify('[A-Z0-9]{10}'),
            'amount' => $amount,
            'payment_type' => $paymentType,
            'status' => $status,
            'payment_method' => fake()->randomElement($paymentMethods),
            'payment_gateway' => fake()->randomElement($gateways),
            'gateway_reference' => fake()->regexify('[A-Z0-9]{15}'),
            'gateway_response' => [
                'transaction_id' => fake()->regexify('[A-Z0-9]{20}'),
                'status_code' => $status === 'completed' ? '200' : '400',
                'status_message' => $status === 'completed' ? 'Success' : 'Pending'
            ],
            'payment_for_month' => $paymentForMonth,
            'due_date' => $dueDate,
            'paid_at' => $status === 'completed' ? fake()->dateTimeBetween($dueDate, 'now') : null,
            'late_fee' => $paymentType === 'late_fee' ? fake()->numberBetween(50000, 200000) : 0,
            'notes' => fake()->optional()->sentence(),
            'receipt_url' => $status === 'completed' ? 'https://example.com/receipts/' . fake()->uuid() . '.pdf' : null,
            'is_auto_payment' => fake()->boolean(30),
        ];
    }

    /**
     * Indicate that the payment is completed.
     */
    public function paid(): static
    {
        return $this->state(function (array $attributes) {
            $dueDate = $attributes['due_date'];
            return [
                'status' => 'completed',
                'paid_at' => fake()->dateTimeBetween($dueDate, 'now'),
                'receipt_url' => 'https://example.com/receipts/' . fake()->uuid() . '.pdf',
                'gateway_response' => [
                    'transaction_id' => fake()->regexify('[A-Z0-9]{20}'),
                    'status_code' => '200',
                    'status_message' => 'Success'
                ],
            ];
        });
    }

    /**
     * Indicate that the payment is pending.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
            'paid_at' => null,
            'receipt_url' => null,
        ]);
    }

    /**
     * Indicate that the payment is overdue.
     */
    public function overdue(): static
    {
        return $this->state(function (array $attributes) {
            $overdueDate = fake()->dateTimeBetween('-2 months', '-1 week');
            return [
                'status' => 'pending',
                'due_date' => $overdueDate,
                'payment_for_month' => $overdueDate,
                'late_fee' => fake()->numberBetween(100000, 300000),
                'paid_at' => null,
            ];
        });
    }

    /**
     * For specific rental and tenant.
     */
    public function forRentalAndTenant(Rental $rental, User $tenant): static
    {
        return $this->state(fn (array $attributes) => [
            'rental_id' => $rental->id,
            'tenant_id' => $tenant->id,
            'amount' => $rental->monthly_rent,
        ]);
    }

    /**
     * For rent payment type.
     */
    public function rent(): static
    {
        return $this->state(fn (array $attributes) => [
            'payment_type' => 'monthly_rent',
        ]);
    }

    /**
     * For deposit payment type.
     */
    public function deposit(): static
    {
        return $this->state(fn (array $attributes) => [
            'payment_type' => 'deposit',
        ]);
    }
}
