<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\TelegramService;

class TelegramSetupCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'telegram:setup {--test-chat-id= : Test chat ID to send test message}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Setup and test Telegram bot configuration';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $telegramService = new TelegramService();

        // Check if bot token is configured
        if (!config('services.telegram.bot_token')) {
            $this->error('Telegram bot token is not configured!');
            $this->info('Please add TELEGRAM_BOT_TOKEN to your .env file');
            return 1;
        }

        // Get bot info
        $this->info('Getting bot information...');
        $botInfo = $telegramService->getBotInfo();
        
        if (!$botInfo) {
            $this->error('Failed to get bot information. Please check your bot token.');
            return 1;
        }

        $this->info('Bot Information:');
        $this->table(
            ['Property', 'Value'],
            [
                ['ID', $botInfo['id']],
                ['Username', '@' . $botInfo['username']],
                ['First Name', $botInfo['first_name']],
                ['Is Bot', $botInfo['is_bot'] ? 'Yes' : 'No'],
            ]
        );

        // Test message if chat ID provided
        $testChatId = $this->option('test-chat-id');
        if ($testChatId) {
            $this->info("Sending test message to chat ID: {$testChatId}");
            
            if ($telegramService->sendTestMessage($testChatId)) {
                $this->info('✅ Test message sent successfully!');
            } else {
                $this->error('❌ Failed to send test message.');
                return 1;
            }
        }

        $this->info('✅ Telegram bot setup completed!');
        $this->newLine();
        $this->info('Next steps:');
        $this->info('1. Add users to your bot by having them send /start to @' . $botInfo['username']);
        $this->info('2. Use the TelegramService to register users with their chat IDs');
        $this->info('3. Users will receive notifications via Telegram');

        return 0;
    }
}
