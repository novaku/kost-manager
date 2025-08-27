<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class TestUserSeeder extends Seeder
{
    /**
     * Run the database seeder.
     */
    public function run(): void
    {
        // Create test users for Telegram testing
        $users = [
            [
                'name' => 'Nova Kusumah',
                'email' => 'nova@kostmanager.com',
                'phone' => '+6281234567890',
                'password' => Hash::make('password'),
                'role' => 'owner',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'John Doe',
                'email' => 'john@example.com',
                'phone' => '+6281234567891',
                'password' => Hash::make('password'),
                'role' => 'tenant',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Jane Smith',
                'email' => 'jane@example.com',
                'phone' => '+6281234567892',
                'password' => Hash::make('password'),
                'role' => 'tenant',
                'email_verified_at' => now(),
            ],
        ];

        foreach ($users as $userData) {
            User::firstOrCreate(
                ['email' => $userData['email']],
                $userData
            );
        }

        $this->command->info('Test users created successfully!');
        $this->command->info('Users:');
        $this->command->info('- Nova Kusumah (nova@kostmanager.com) - Owner');
        $this->command->info('- John Doe (john@example.com) - Tenant');
        $this->command->info('- Jane Smith (jane@example.com) - Tenant');
    }
}
