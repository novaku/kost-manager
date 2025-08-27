<?php

namespace App\Services;

use App\Models\User;
use App\Models\UserTelegram;
use TelegramBot\Api\BotApi;
use TelegramBot\Api\Exception;
use Illuminate\Support\Facades\Log;

class TelegramService
{
    protected $botApi;

    public function __construct()
    {
        $botToken = config('services.telegram.bot_token');
        if ($botToken) {
            $this->botApi = new BotApi($botToken);
        }
    }

    /**
     * Register a user's Telegram chat ID
     *
     * @param User $user
     * @param string $chatId
     * @param array $telegramUserData
     * @return UserTelegram|null
     */
    public function registerUser(User $user, string $chatId, array $telegramUserData = [])
    {
        try {
            // Check if user already has Telegram registration
            $existingTelegram = UserTelegram::where('user_id', $user->id)->first();
            
            if ($existingTelegram) {
                // Update existing record
                $existingTelegram->update([
                    'chat_id' => $chatId,
                    'phone' => $user->phone,
                    'username' => $telegramUserData['username'] ?? null,
                    'first_name' => $telegramUserData['first_name'] ?? null,
                    'last_name' => $telegramUserData['last_name'] ?? null,
                    'is_active' => true,
                    'registered_at' => now(),
                ]);
                
                return $existingTelegram;
            }

            // Create new registration
            return UserTelegram::create([
                'user_id' => $user->id,
                'phone' => $user->phone,
                'chat_id' => $chatId,
                'username' => $telegramUserData['username'] ?? null,
                'first_name' => $telegramUserData['first_name'] ?? null,
                'last_name' => $telegramUserData['last_name'] ?? null,
                'is_active' => true,
                'registered_at' => now(),
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to register Telegram user', [
                'user_id' => $user->id,
                'chat_id' => $chatId,
                'error' => $e->getMessage()
            ]);
            return null;
        }
    }

    /**
     * Send a test message to verify Telegram setup
     *
     * @param string $chatId
     * @param string $message
     * @return bool
     */
    public function sendTestMessage(string $chatId, string $message = null): bool
    {
        if (!$this->botApi) {
            return false;
        }

        $message = $message ?? "🤖 Test message dari Kost Manager!\n\nTelegram notification berhasil dikonfigurasi.";

        try {
            $this->botApi->sendMessage($chatId, $message, 'HTML');
            return true;
        } catch (Exception $e) {
            Log::error('Failed to send test Telegram message', [
                'chat_id' => $chatId,
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }

    /**
     * Get bot information
     *
     * @return array|null
     */
    public function getBotInfo(): ?array
    {
        if (!$this->botApi) {
            return null;
        }

        try {
            $botInfo = $this->botApi->getMe();
            return [
                'id' => $botInfo->getId(),
                'username' => $botInfo->getUsername(),
                'first_name' => $botInfo->getFirstName(),
                'is_bot' => $botInfo->isBot(),
            ];
        } catch (Exception $e) {
            Log::error('Failed to get bot info', ['error' => $e->getMessage()]);
            return null;
        }
    }

    /**
     * Find user by Telegram chat ID
     *
     * @param string $chatId
     * @return User|null
     */
    public function findUserByChatId(string $chatId): ?User
    {
        $userTelegram = UserTelegram::findByChatId($chatId);
        return $userTelegram ? $userTelegram->user : null;
    }

    /**
     * Deactivate user's Telegram registration
     *
     * @param User $user
     * @return bool
     */
    public function deactivateUser(User $user): bool
    {
        $userTelegram = UserTelegram::where('user_id', $user->id)->first();
        
        if ($userTelegram) {
            return $userTelegram->update(['is_active' => false]);
        }
        
        return false;
    }
}
