<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin/test users
        User::factory()->create([
            'name' => 'Admin Owner',
            'email' => 'owner@example.com',
            'password' => Hash::make('password'),
            'role' => 'owner',
            'phone' => '+62812345678',
            'is_active' => true,
        ]);

        User::factory()->create([
            'name' => 'Test Tenant',
            'email' => 'tenant@example.com',
            'password' => Hash::make('password'),
            'role' => 'tenant',
            'phone' => '+62812345679',
            'is_active' => true,
        ]);

        // Create additional owners
        User::factory(3)->owner()->create();

        // Create tenants
        User::factory(19)->tenant()->create();

        $this->command->info('Users seeded successfully!');
    }
}
