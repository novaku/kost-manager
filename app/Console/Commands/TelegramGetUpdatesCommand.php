<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\TelegramService;
use TelegramBot\Api\BotApi;

class TelegramGetUpdatesCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'telegram:get-updates';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Get recent updates from Telegram to find chat IDs';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $botToken = config('services.telegram.bot_token');
        
        if (!$botToken) {
            $this->error('Telegram bot token is not configured!');
            return 1;
        }

        try {
            $botApi = new BotApi($botToken);
            $updates = $botApi->getUpdates();
            
            if (empty($updates)) {
                $this->info('No recent updates found.');
                $this->info('Send a message to your bot (@kostmanager_bot) first, then run this command again.');
                return 0;
            }

            $this->info('Recent chat interactions:');
            $this->newLine();

            foreach ($updates as $update) {
                if ($update->getMessage()) {
                    $message = $update->getMessage();
                    $chat = $message->getChat();
                    $from = $message->getFrom();
                    
                    $this->table(
                        ['Property', 'Value'],
                        [
                            ['Chat ID', $chat->getId()],
                            ['Chat Type', $chat->getType()],
                            ['First Name', $from->getFirstName()],
                            ['Last Name', $from->getLastName() ?? 'N/A'],
                            ['Username', $from->getUsername() ? '@' . $from->getUsername() : 'N/A'],
                            ['Message', $message->getText()],
                            ['Date', date('Y-m-d H:i:s', $message->getDate())],
                        ]
                    );
                    $this->newLine();
                }
            }

            $this->info('💡 Use one of the Chat IDs above to test sending messages:');
            $this->info('php artisan telegram:setup --test-chat-id=CHAT_ID');

        } catch (\Exception $e) {
            $this->error('Failed to get updates: ' . $e->getMessage());
            return 1;
        }

        return 0;
    }
}
