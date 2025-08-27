<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\TelegramService;
use App\Models\User;
use App\Models\UserTelegram;
use TelegramBot\Api\BotApi;

class TelegramManageChatIdsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'telegram:manage-chats 
                            {--register= : Register chat ID to user by phone number}
                            {--list : List all registered users}
                            {--updates : Show recent updates with registration option}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Manage Telegram chat IDs and user registrations';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $telegramService = new TelegramService();

        if ($this->option('list')) {
            $this->listRegisteredUsers();
            return 0;
        }

        if ($this->option('register')) {
            $phone = $this->option('register');
            $this->registerUserByPhone($telegramService, $phone);
            return 0;
        }

        if ($this->option('updates')) {
            $this->showUpdatesWithRegistration($telegramService);
            return 0;
        }

        // Default: show menu
        $this->showMenu($telegramService);
        return 0;
    }

    private function showMenu(TelegramService $telegramService)
    {
        $this->info('🤖 Telegram Chat ID Management');
        $this->newLine();

        $choice = $this->choice('What would you like to do?', [
            'show-updates' => 'Show recent updates and get Chat IDs',
            'list-users' => 'List registered users with Chat IDs',
            'register-user' => 'Register a Chat ID to a user',
            'test-message' => 'Send test message to a Chat ID'
        ]);

        switch ($choice) {
            case 'show-updates':
                $this->showUpdatesWithRegistration($telegramService);
                break;
            case 'list-users':
                $this->listRegisteredUsers();
                break;
            case 'register-user':
                $this->interactiveRegisterUser($telegramService);
                break;
            case 'test-message':
                $this->interactiveTestMessage($telegramService);
                break;
        }
    }

    private function showUpdatesWithRegistration(TelegramService $telegramService)
    {
        $botToken = config('services.telegram.bot_token');
        
        if (!$botToken) {
            $this->error('Telegram bot token is not configured!');
            return;
        }

        try {
            $botApi = new BotApi($botToken);
            $updates = $botApi->getUpdates();
            
            if (empty($updates)) {
                $this->info('No recent updates found.');
                $this->info('Ask users to send /start to @kostmanager_bot first.');
                return;
            }

            $this->info('📱 Recent Telegram Interactions:');
            $this->newLine();

            $chatData = [];
            foreach ($updates as $update) {
                if ($update->getMessage()) {
                    $message = $update->getMessage();
                    $chat = $message->getChat();
                    $from = $message->getFrom();
                    
                    $chatId = $chat->getId();
                    $chatData[$chatId] = [
                        'chat_id' => $chatId,
                        'first_name' => $from->getFirstName(),
                        'last_name' => $from->getLastName(),
                        'username' => $from->getUsername(),
                        'last_message' => $message->getText(),
                        'date' => date('Y-m-d H:i:s', $message->getDate())
                    ];
                }
            }

            // Display chat data
            foreach ($chatData as $data) {
                $this->table(
                    ['Property', 'Value'],
                    [
                        ['Chat ID', $data['chat_id']],
                        ['Name', $data['first_name'] . ' ' . ($data['last_name'] ?? '')],
                        ['Username', $data['username'] ? '@' . $data['username'] : 'N/A'],
                        ['Last Message', $data['last_message']],
                        ['Date', $data['date']],
                    ]
                );

                // Check if already registered
                $userTelegram = UserTelegram::where('chat_id', $data['chat_id'])->first();
                if ($userTelegram) {
                    $this->info("✅ Already registered to: {$userTelegram->user->name} ({$userTelegram->user->email})");
                } else {
                    $this->warn("⚠️  Not registered to any user");
                    
                    if ($this->confirm("Register this chat ID to a user?")) {
                        $this->registerChatIdToUser($telegramService, $data['chat_id'], $data);
                    }
                }
                $this->newLine();
            }

        } catch (\Exception $e) {
            $this->error('Failed to get updates: ' . $e->getMessage());
        }
    }

    private function listRegisteredUsers()
    {
        $userTelegrams = UserTelegram::with('user')->where('is_active', true)->get();

        if ($userTelegrams->isEmpty()) {
            $this->info('No users registered with Telegram yet.');
            return;
        }

        $this->info('📋 Registered Telegram Users:');
        $this->newLine();

        $tableData = [];
        foreach ($userTelegrams as $userTelegram) {
            $tableData[] = [
                $userTelegram->user->name,
                $userTelegram->user->email,
                $userTelegram->user->phone,
                $userTelegram->chat_id,
                $userTelegram->username ? '@' . $userTelegram->username : 'N/A',
                $userTelegram->registered_at->format('Y-m-d H:i')
            ];
        }

        $this->table(
            ['Name', 'Email', 'Phone', 'Chat ID', 'Username', 'Registered'],
            $tableData
        );
    }

    private function registerChatIdToUser(TelegramService $telegramService, string $chatId, array $telegramData)
    {
        $users = User::all();
        
        if ($users->isEmpty()) {
            $this->error('No users found in database.');
            return;
        }

        $userOptions = [];
        foreach ($users as $user) {
            $userOptions[$user->id] = "{$user->name} ({$user->email}) - {$user->phone}";
        }

        $userId = $this->choice('Select user to register this Chat ID to:', $userOptions);
        $user = User::find($userId);

        if ($user) {
            $result = $telegramService->registerUser($user, $chatId, $telegramData);
            
            if ($result) {
                $this->info("✅ Successfully registered Chat ID {$chatId} to {$user->name}");
            } else {
                $this->error("❌ Failed to register Chat ID {$chatId} to {$user->name}");
            }
        }
    }

    private function interactiveRegisterUser(TelegramService $telegramService)
    {
        $chatId = $this->ask('Enter Chat ID:');
        $phone = $this->ask('Enter user phone number:');

        $user = User::where('phone', $phone)->first();
        
        if (!$user) {
            $this->error("User with phone {$phone} not found.");
            return;
        }

        $result = $telegramService->registerUser($user, $chatId);
        
        if ($result) {
            $this->info("✅ Successfully registered Chat ID {$chatId} to {$user->name}");
        } else {
            $this->error("❌ Failed to register Chat ID {$chatId} to {$user->name}");
        }
    }

    private function interactiveTestMessage(TelegramService $telegramService)
    {
        $chatId = $this->ask('Enter Chat ID to test:');
        $message = $this->ask('Enter test message (or leave empty for default):');

        if (empty($message)) {
            $message = "🧪 Test message dari Kost Manager!\n\nTelegram berhasil terhubung.";
        }

        if ($telegramService->sendTestMessage($chatId, $message)) {
            $this->info("✅ Message sent successfully to Chat ID: {$chatId}");
        } else {
            $this->error("❌ Failed to send message to Chat ID: {$chatId}");
        }
    }

    private function registerUserByPhone(TelegramService $telegramService, string $phone)
    {
        $user = User::where('phone', $phone)->first();
        
        if (!$user) {
            $this->error("User with phone {$phone} not found.");
            return;
        }

        $chatId = $this->ask('Enter Chat ID for this user:');
        
        $result = $telegramService->registerUser($user, $chatId);
        
        if ($result) {
            $this->info("✅ Successfully registered Chat ID {$chatId} to {$user->name}");
        } else {
            $this->error("❌ Failed to register Chat ID {$chatId} to {$user->name}");
        }
    }
}
