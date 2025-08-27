<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\Payment;
use App\Models\Rental;
use App\Notifications\PaymentReceivedNotification;
use App\Notifications\PaymentReminderNotification;
use App\Notifications\RentalApprovedNotification;

class TelegramTestNotificationsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'telegram:test-notifications 
                            {--user-id= : User ID to send notifications to}
                            {--chat-id= : Chat ID to send test notifications}
                            {--type= : Notification type (payment-received, payment-reminder, rental-approved)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test actual notification classes via Telegram';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $userId = $this->option('user-id');
        $chatId = $this->option('chat-id');
        $type = $this->option('type');

        if (!$userId && !$chatId) {
            $this->error('Please provide either --user-id or --chat-id');
            return 1;
        }

        if ($userId) {
            $user = User::find($userId);
            if (!$user) {
                $this->error("User with ID {$userId} not found.");
                return 1;
            }
        } else {
            // Create a mock user for chat ID testing
            $user = new User([
                'name' => 'Test User',
                'email' => 'test@example.com',
                'phone' => '+6281234567890'
            ]);
            $user->id = 999; // Mock ID
        }

        $availableTypes = ['payment-received', 'payment-reminder', 'rental-approved'];

        if (!$type || !in_array($type, $availableTypes)) {
            $type = $this->choice('Which notification would you like to test?', $availableTypes);
        }

        try {
            switch ($type) {
                case 'payment-received':
                    $this->testPaymentReceived($user, $chatId);
                    break;
                case 'payment-reminder':
                    $this->testPaymentReminder($user, $chatId);
                    break;
                case 'rental-approved':
                    $this->testRentalApproved($user, $chatId);
                    break;
            }

            $this->info("✅ {$type} notification test completed!");

        } catch (\Exception $e) {
            $this->error("❌ Failed to send notification: " . $e->getMessage());
            return 1;
        }

        return 0;
    }

    private function testPaymentReceived(User $user, ?string $chatId = null)
    {
        $this->info('Testing PaymentReceivedNotification...');

        // Create mock payment data
        $mockPayment = new Payment([
            'amount' => 1500000,
            'payment_date' => now(),
            'payment_method' => 'bank_transfer',
            'status' => 'completed'
        ]);
        $mockPayment->id = 123;

        $notification = new PaymentReceivedNotification($mockPayment);

        if ($chatId) {
            // Send directly to chat ID
            $this->sendToChatId($notification, $chatId);
        } else {
            // Send via user
            $user->notify($notification);
        }
    }

    private function testPaymentReminder(User $user, ?string $chatId = null)
    {
        $this->info('Testing PaymentReminderNotification...');

        // Create mock notification with required parameters
        $dueDate = now()->addDays(5);
        $amount = 1500000;
        $kostanName = 'Kost Harmoni Jakarta';
        $roomNumber = 'A-101';

        $notification = new PaymentReminderNotification($dueDate, $amount, $kostanName, $roomNumber);

        if ($chatId) {
            // Send directly to chat ID
            $this->sendToChatId($notification, $chatId);
        } else {
            // Send via user
            $user->notify($notification);
        }
    }

    private function testRentalApproved(User $user, ?string $chatId = null)
    {
        $this->info('Testing RentalApprovedNotification...');

        // Create mock rental data with room and kostan relationships
        $mockKostan = new \App\Models\Kostan([
            'name' => 'Kost Harmoni Jakarta',
            'address' => 'Jl. Harmoni No. 123, Jakarta'
        ]);
        $mockKostan->id = 1;

        $mockRoom = new \App\Models\Room([
            'name' => 'A-101',
            'type' => 'single',
            'price' => 1500000
        ]);
        $mockRoom->id = 1;
        $mockRoom->setRelation('kostan', $mockKostan);

        $mockRental = new Rental([
            'monthly_price' => 1500000,
            'start_date' => now(),
            'end_date' => now()->addMonth(),
            'status' => 'approved'
        ]);
        $mockRental->id = 789;
        $mockRental->setRelation('room', $mockRoom);

        $notification = new RentalApprovedNotification($mockRental);

        if ($chatId) {
            // Send directly to chat ID
            $this->sendToChatId($notification, $chatId);
        } else {
            // Send via user
            $user->notify($notification);
        }
    }

    private function sendToChatId($notification, string $chatId)
    {
        // For direct chat ID testing, we'll use the TelegramService directly
        $telegramService = new \App\Services\TelegramService();
        
        // Create a mock user for notification
        $mockUser = new User([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'phone' => '+6281234567890'
        ]);
        $mockUser->id = 999;
        
        // Get the message content from notification
        $telegramData = $notification->toTelegram($mockUser);
        $message = is_array($telegramData) ? ($telegramData['text'] ?? 'Test notification') : $telegramData;
        
        $telegramService->sendTestMessage($chatId, $message);
    }
}
