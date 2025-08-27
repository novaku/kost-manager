<?php

namespace App\Channels;

use Illuminate\Notifications\Notification;
use App\Contracts\TelegramNotifiable;
use TelegramBot\Api\BotApi;
use TelegramBot\Api\Exception;
use Illuminate\Support\Facades\Log;

class TelegramChannel
{
    /**
     * Send the given notification.
     *
     * @param  mixed  $notifiable
     * @param  \Illuminate\Notifications\Notification  $notification
     * @return void
     */
    public function send($notifiable, Notification $notification)
    {
        // Get Telegram bot token from config
        $botToken = config('services.telegram.bot_token');
        
        if (!$botToken) {
            Log::warning('Telegram bot token not configured');
            return;
        }

        // Get user's phone number
        $phoneNumber = $notifiable->phone;
        
        if (!$phoneNumber) {
            Log::warning('User does not have a phone number', ['user_id' => $notifiable->id]);
            return;
        }

        // Get Telegram chat ID from phone number
        $chatId = $this->getChatIdFromPhone($phoneNumber);
        
        if (!$chatId) {
            Log::warning('Could not find Telegram chat ID for phone number', ['phone' => $phoneNumber]);
            return;
        }

        // Get the message content
        if (!$notification instanceof TelegramNotifiable) {
            Log::warning('Notification does not support Telegram', [
                'notification_class' => get_class($notification),
                'user_id' => $notifiable->id
            ]);
            return;
        }
        
        $message = $notification->toTelegram($notifiable);
        
        if (!$message) {
            Log::warning('Telegram message content is empty', [
                'notification_class' => get_class($notification),
                'user_id' => $notifiable->id
            ]);
            return;
        }
        
        try {
            $telegram = new BotApi($botToken);
            $telegram->sendMessage($chatId, $message, 'HTML');
            
            Log::info('Telegram notification sent successfully', [
                'user_id' => $notifiable->id,
                'phone' => $phoneNumber,
                'chat_id' => $chatId
            ]);
        } catch (Exception $e) {
            Log::error('Failed to send Telegram notification', [
                'user_id' => $notifiable->id,
                'phone' => $phoneNumber,
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Get Telegram chat ID from phone number
     *
     * @param string $phoneNumber
     * @return string|null
     */
    private function getChatIdFromPhone($phoneNumber)
    {
        $userTelegram = \App\Models\UserTelegram::findByPhone($phoneNumber);
        return $userTelegram ? $userTelegram->chat_id : null;
    }
}
