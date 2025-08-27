<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Kostan;
use App\Models\Room;
use App\Models\Rental;
use App\Models\Payment;
use App\Models\Review;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create admin/test users
        $adminOwner = User::factory()->create([
            'name' => 'Admin Owner',
            'email' => 'owner@example.com',
            'password' => Hash::make('password'),
            'role' => 'owner',
            'phone' => '+62812345678',
            'is_active' => true,
        ]);

        $testTenant = User::factory()->create([
            'name' => 'Test Tenant',
            'email' => 'tenant@example.com',
            'password' => Hash::make('password'),
            'role' => 'tenant',
            'phone' => '+62812345679',
            'is_active' => true,
        ]);

        // Create additional owners (3 more)
        $owners = User::factory(3)->owner()->create();
        $owners->push($adminOwner); // Add admin owner to collection

        // Create tenants (20 total including test tenant)
        $tenants = User::factory(19)->tenant()->create();
        $tenants->push($testTenant); // Add test tenant to collection

        // Create kostans for each owner
        $kostans = collect();
        foreach ($owners as $owner) {
            $ownerKostans = Kostan::factory(rand(1, 3))->forOwner($owner)->create();
            $kostans = $kostans->merge($ownerKostans);
        }

        echo "Created " . $kostans->count() . " kostans\n";

        // Create rooms for each kostan
        $rooms = collect();
        foreach ($kostans as $kostan) {
            $roomCount = rand(8, 15);
            
            for ($i = 1; $i <= $roomCount; $i++) {
                $room = Room::factory()->forKostan($kostan)->create([
                    'room_number' => sprintf('%s%02d', fake()->randomElement(['A', 'B', 'C']), $i),
                ]);
                
                // Set room status
                if ($i <= $roomCount * 0.6) { // 60% occupied
                    $room->update(['status' => 'occupied']);
                } elseif ($i <= $roomCount * 0.8) { // 20% available
                    $room->update(['status' => 'available']);
                } else { // 20% maintenance
                    $room->update(['status' => 'maintenance']);
                }
                
                $rooms->push($room);
            }
        }

        echo "Created " . $rooms->count() . " rooms\n";

        // Create rentals for occupied rooms
        $occupiedRooms = $rooms->where('status', 'occupied');
        $rentals = collect();
        
        foreach ($occupiedRooms as $room) {
            $tenant = $tenants->random();
            
            // Make sure this tenant doesn't already have an active rental
            if (!$rentals->where('tenant_id', $tenant->id)->where('status', 'active')->count()) {
                $rental = Rental::factory()
                    ->active()
                    ->forRoomAndTenant($room, $tenant)
                    ->create();
                
                $rentals->push($rental);
                
                // Update room occupancy
                $room->update(['current_occupancy' => $room->max_occupancy]);
            }
        }

        // Create some pending rentals
        $availableRooms = $rooms->where('status', 'available')->take(5);
        foreach ($availableRooms as $room) {
            $tenant = $tenants->random();
            $rental = Rental::factory()
                ->pending()
                ->forRoomAndTenant($room, $tenant)
                ->create();
            
            $rentals->push($rental);
        }

        // Create some expired rentals
        $expiredRentals = Rental::factory(10)
            ->expired()
            ->create([
                'room_id' => fn() => $rooms->random()->id,
                'tenant_id' => fn() => $tenants->random()->id,
            ]);
        
        $rentals = $rentals->merge($expiredRentals);

        echo "Created " . $rentals->count() . " rentals\n";

        // Create payments for rentals
        $payments = collect();
        
        foreach ($rentals->where('status', 'active') as $rental) {
            // Create deposit payment
            $depositPayment = Payment::factory()
                ->paid()
                ->deposit()
                ->forRentalAndTenant($rental, $rental->tenant)
                ->create([
                    'amount' => $rental->deposit_paid,
                    'payment_for_month' => $rental->start_date,
                    'due_date' => $rental->start_date,
                ]);
            $payments->push($depositPayment);
            
            // Create monthly rent payments (last 6 months)
            for ($i = 6; $i >= 1; $i--) {
                $paymentMonth = now()->subMonths($i);
                $dueDate = $paymentMonth->copy()->startOfMonth();
                
                $rentPayment = Payment::factory()
                    ->paid()
                    ->rent()
                    ->forRentalAndTenant($rental, $rental->tenant)
                    ->create([
                        'amount' => $rental->monthly_rent,
                        'payment_for_month' => $paymentMonth,
                        'due_date' => $dueDate,
                        'paid_at' => $dueDate->copy()->addDays(rand(0, 5)),
                    ]);
                $payments->push($rentPayment);
            }
            
            // Current month payment (some paid, some pending)
            $currentMonthPayment = Payment::factory()
                ->forRentalAndTenant($rental, $rental->tenant)
                ->create([
                    'status' => rand(0, 1) ? 'completed' : 'pending',
                    'payment_type' => 'monthly_rent',
                    'amount' => $rental->monthly_rent,
                    'payment_for_month' => now(),
                    'due_date' => now()->startOfMonth(),
                    'paid_at' => rand(0, 1) ? now()->subDays(rand(1, 15)) : null,
                ]);
            $payments->push($currentMonthPayment);
        }

        // Create some overdue payments
        $overduePayments = Payment::factory(8)
            ->overdue()
            ->create([
                'rental_id' => fn() => $rentals->where('status', 'active')->random()->id,
                'tenant_id' => fn() => $tenants->random()->id,
            ]);
        
        $payments = $payments->merge($overduePayments);

        echo "Created " . $payments->count() . " payments\n";

        // Create reviews for kostans
        $reviews = collect();
        $usedTenantKostanPairs = collect();
        
        foreach ($kostans as $kostan) {
            $reviewCount = rand(3, 8);
            $availableTenants = $tenants->shuffle();
            
            for ($i = 0; $i < $reviewCount && $i < $availableTenants->count(); $i++) {
                $tenant = $availableTenants[$i];
                $pairKey = $kostan->id . '-' . $tenant->id;
                
                if (!$usedTenantKostanPairs->contains($pairKey)) {
                    $review = Review::factory()
                        ->approved()
                        ->create([
                            'kostan_id' => $kostan->id,
                            'tenant_id' => $tenant->id,
                        ]);
                    
                    $reviews->push($review);
                    $usedTenantKostanPairs->push($pairKey);
                }
            }
            
            // Update kostan's average rating and total reviews
            $kostanReviews = $reviews->where('kostan_id', $kostan->id);
            if ($kostanReviews->count() > 0) {
                $avgRating = $kostanReviews->avg('rating');
                $kostan->update([
                    'average_rating' => round($avgRating, 1),
                    'total_reviews' => $kostanReviews->count(),
                ]);
            }
        }

        // Create some pending reviews
        $remainingTenants = $tenants->shuffle()->take(5);
        foreach ($remainingTenants as $tenant) {
            $availableKostans = $kostans->filter(function ($kostan) use ($usedTenantKostanPairs, $tenant) {
                return !$usedTenantKostanPairs->contains($kostan->id . '-' . $tenant->id);
            });
            
            if ($availableKostans->count() > 0) {
                $kostan = $availableKostans->random();
                $review = Review::factory()
                    ->pending()
                    ->create([
                        'kostan_id' => $kostan->id,
                        'tenant_id' => $tenant->id,
                    ]);
                
                $reviews->push($review);
            }
        }

        echo "Created " . $reviews->count() . " reviews\n";

        echo "\n=== Seeding Completed ===\n";
        echo "Summary:\n";
        echo "- Users: " . User::count() . " (Owners: " . User::where('role', 'owner')->count() . ", Tenants: " . User::where('role', 'tenant')->count() . ")\n";
        echo "- Kostans: " . Kostan::count() . "\n";
        echo "- Rooms: " . Room::count() . " (Available: " . Room::where('status', 'available')->count() . ", Occupied: " . Room::where('status', 'occupied')->count() . ")\n";
        echo "- Rentals: " . Rental::count() . " (Active: " . Rental::where('status', 'active')->count() . ", Pending: " . Rental::where('status', 'pending')->count() . ")\n";
        echo "- Payments: " . Payment::count() . " (Completed: " . Payment::where('status', 'completed')->count() . ", Pending: " . Payment::where('status', 'pending')->count() . ")\n";
        echo "- Reviews: " . Review::count() . " (Published: " . Review::where('is_published', true)->count() . ")\n";
        echo "\nTest Accounts:\n";
        echo "- Owner: owner@example.com / password\n";
        echo "- Tenant: tenant@example.com / password\n";
    }
}
