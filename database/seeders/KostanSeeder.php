<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Kostan;
use Illuminate\Database\Seeder;

class KostanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $owners = User::where('role', 'owner')->get();

        foreach ($owners as $owner) {
            $kostanCount = rand(1, 3);
            Kostan::factory($kostanCount)->forOwner($owner)->create();
        }

        $this->command->info('Kostans seeded successfully!');
    }
}
