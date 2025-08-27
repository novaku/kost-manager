<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserTelegram extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'phone',
        'chat_id',
        'username',
        'first_name',
        'last_name',
        'is_active',
        'registered_at',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'registered_at' => 'datetime',
    ];

    /**
     * Get the user that owns the Telegram account.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get Telegram info by phone number
     */
    public static function findByPhone(string $phone): ?self
    {
        return static::where('phone', $phone)
            ->where('is_active', true)
            ->first();
    }

    /**
     * Get Telegram info by chat ID
     */
    public static function findByChatId(string $chatId): ?self
    {
        return static::where('chat_id', $chatId)
            ->where('is_active', true)
            ->first();
    }
}
