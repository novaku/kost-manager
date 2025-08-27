<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\TelegramService;
use App\Models\User;

class TelegramTestCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'telegram:test 
                            {--chat-id= : Direct chat ID to send message}
                            {--user-id= : User ID to send message via registered Telegram}
                            {--phone= : Phone number to find user and send message}
                            {--message= : Custom message to send}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test sending Telegram messages with various options';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $telegramService = new TelegramService();
        $chatId = $this->option('chat-id');
        $userId = $this->option('user-id');
        $phone = $this->option('phone');
        $customMessage = $this->option('message');

        // Default test message
        $message = $customMessage ?? "🧪 Test Message dari Kost Manager\n\n" .
            "✅ Telegram integration bekerja dengan baik!\n" .
            "📅 Waktu: " . now()->format('d/m/Y H:i:s') . "\n" .
            "🤖 Bot: @kostmanager_bot";

        // Method 1: Direct chat ID
        if ($chatId) {
            $this->info("Sending message to chat ID: {$chatId}");
            
            if ($telegramService->sendTestMessage($chatId, $message)) {
                $this->info('✅ Message sent successfully via chat ID!');
                return 0;
            } else {
                $this->error('❌ Failed to send message via chat ID.');
                return 1;
            }
        }

        // Method 2: User ID
        if ($userId) {
            $user = User::find($userId);
            if (!$user) {
                $this->error("User with ID {$userId} not found.");
                return 1;
            }

            $this->info("Sending message to user: {$user->name} ({$user->email})");
            
            if ($this->sendToUser($telegramService, $user, $message)) {
                return 0;
            } else {
                return 1;
            }
        }

        // Method 3: Phone number
        if ($phone) {
            $user = User::where('phone', $phone)->first();
            if (!$user) {
                $this->error("User with phone {$phone} not found.");
                return 1;
            }

            $this->info("Sending message to user: {$user->name} ({$user->phone})");
            
            if ($this->sendToUser($telegramService, $user, $message)) {
                return 0;
            } else {
                return 1;
            }
        }

        // If no specific target, show usage examples
        $this->info('Telegram Test Command Usage Examples:');
        $this->newLine();
        $this->info('1. Send to specific chat ID:');
        $this->line('   php artisan telegram:test --chat-id=417041168');
        $this->newLine();
        $this->info('2. Send to user by ID:');
        $this->line('   php artisan telegram:test --user-id=1');
        $this->newLine();
        $this->info('3. Send to user by phone:');
        $this->line('   php artisan telegram:test --phone=+6281234567890');
        $this->newLine();
        $this->info('4. Send custom message:');
        $this->line('   php artisan telegram:test --chat-id=417041168 --message="Hello from Kost Manager!"');

        return 0;
    }

    private function sendToUser(TelegramService $telegramService, User $user, string $message): bool
    {
        // Check if user has Telegram registration
        $userTelegram = $user->telegram;
        
        if (!$userTelegram || !$userTelegram->is_active) {
            $this->error("User {$user->name} does not have active Telegram registration.");
            $this->info("Register user first or use: php artisan telegram:test --chat-id=CHAT_ID");
            return false;
        }

        if ($telegramService->sendTestMessage($userTelegram->chat_id, $message)) {
            $this->info("✅ Message sent successfully to {$user->name}!");
            $this->info("📱 Chat ID: {$userTelegram->chat_id}");
            return true;
        } else {
            $this->error("❌ Failed to send message to {$user->name}.");
            return false;
        }
    }
}
