<?php

namespace App\Contracts;

interface TelegramNotifiable
{
    /**
     * Get the Telegram representation of the notification.
     *
     * @param  object  $notifiable
     * @return string
     */
    public function toTelegram(object $notifiable): string;
}
