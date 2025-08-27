# Telegram Testing Guide for Kost Manager

## How to Get CHAT_ID

### Method 1: Using Built-in Commands (Easiest) ⭐

#### Step 1: Send a message to your bot
1. Open Telegram
2. Search for `@kostmanager_bot`
3. Send `/start` to the bot

#### Step 2: Get the Chat ID
```bash
php artisan telegram:get-updates
```

This will show you:
```
Recent chat interactions:
+------------+---------------------+
| Property   | Value               |
+------------+---------------------+
| Chat ID    | 417041168           |
| Chat Type  | private             |
| First Name | Nova                |
| Last Name  | Kusumah             |
| Username   | @novaherdi          |
| Message    | /start              |
| Date       | 2025-08-26 14:05:52 |
+------------+---------------------+
```

**Your Chat ID is: `417041168`**

### Method 2: Comprehensive Chat Management

```bash
# Interactive menu for managing chat IDs
php artisan telegram:manage-chats

# Show recent updates with registration options
php artisan telegram:manage-chats --updates

# List all registered users
php artisan telegram:manage-chats --list

# Register chat ID to specific phone number
php artisan telegram:manage-chats --register=+6281234567890
```

### Method 3: Manual API Call

Visit this URL in your browser:
```
https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates
```

Replace `<YOUR_BOT_TOKEN>` with your actual bot token.

### Method 4: Using @userinfobot

1. Forward any message from the user to `@userinfobot`
2. It will reply with the user's Chat ID

## Quick Testing Methods

### Method 1: Artisan Commands (Recommended)

#### Basic Setup Test
```bash
php artisan telegram:setup
```

#### Get Chat IDs
```bash
# First, send /start to @kostmanager_bot in Telegram
php artisan telegram:get-updates
```

#### Send Test Messages
```bash
# Simple test message
php artisan telegram:test --chat-id=YOUR_CHAT_ID

# Custom message
php artisan telegram:test --chat-id=YOUR_CHAT_ID --message="Custom test message"

# Test by user ID (if user has Telegram registration)
php artisan telegram:test --user-id=1

# Test by phone number
php artisan telegram:test --phone=+6281234567890
```

#### Test Notification Classes
```bash
# Test payment reminder
php artisan telegram:test-notifications --chat-id=YOUR_CHAT_ID --type=payment-reminder

# Test payment received
php artisan telegram:test-notifications --chat-id=YOUR_CHAT_ID --type=payment-received

# Test rental approved
php artisan telegram:test-notifications --chat-id=YOUR_CHAT_ID --type=rental-approved
```

### Method 2: Laravel Tinker

```bash
php artisan tinker
```

```php
// Basic message test
$telegramService = new App\Services\TelegramService();
$telegramService->sendTestMessage('YOUR_CHAT_ID', 'Hello from Tinker!');

// Test with bot info
$botInfo = $telegramService->getBotInfo();
print_r($botInfo);

// Test notification
$user = App\Models\User::first();
$notification = new App\Notifications\PaymentReminderNotification(
    now()->addDays(5), 
    1500000, 
    'Kost Harmoni', 
    'A-101'
);
$user->notify($notification);
```

### Method 3: Unit Tests

Create test file: `tests/Feature/TelegramTest.php`

```php
<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Services\TelegramService;
use App\Models\User;
use App\Notifications\PaymentReminderNotification;

class TelegramTest extends TestCase
{
    public function test_telegram_service_can_get_bot_info()
    {
        $telegramService = new TelegramService();
        $botInfo = $telegramService->getBotInfo();
        
        $this->assertIsArray($botInfo);
        $this->assertArrayHasKey('username', $botInfo);
    }

    public function test_can_send_test_message()
    {
        $telegramService = new TelegramService();
        $result = $telegramService->sendTestMessage('YOUR_CHAT_ID', 'Test message');
        
        $this->assertTrue($result);
    }
}
```

Run tests:
```bash
php artisan test --filter=TelegramTest
```

### Method 4: API Endpoints

Create test routes in `routes/web.php`:

```php
Route::get('/test-telegram/{chatId}', function ($chatId) {
    $telegramService = new App\Services\TelegramService();
    $result = $telegramService->sendTestMessage($chatId, 'Test from web route!');
    
    return response()->json([
        'success' => $result,
        'message' => $result ? 'Message sent!' : 'Failed to send message'
    ]);
});
```

Access: `http://localhost:8000/test-telegram/YOUR_CHAT_ID`

## Troubleshooting

### Common Issues

1. **Bot token not configured**
   ```bash
   # Add to .env
   TELEGRAM_BOT_TOKEN=your_bot_token_here
   ```

2. **Chat ID not found**
   - Send `/start` to your bot first
   - Run `php artisan telegram:get-updates` to get chat ID

3. **Failed to send message**
   - Check bot token validity
   - Verify chat ID is correct
   - Ensure user hasn't blocked the bot

4. **Notification not working**
   - Check if user has active Telegram registration
   - Verify notification channels are configured properly

### Environment Setup

```env
# .env file
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
```

### Bot Setup Steps

1. Create bot with @BotFather in Telegram
2. Get bot token and add to .env
3. Test with `php artisan telegram:setup`
4. Send `/start` to your bot
5. Get chat ID with `php artisan telegram:get-updates`
6. Test notifications

## Example Chat IDs
- Your current chat ID: `417041168`
- Bot username: `@kostmanager_bot`

## Production Considerations

1. Store chat IDs securely in database
2. Handle failed message delivery gracefully
3. Implement rate limiting
4. Add user privacy controls
5. Monitor bot performance and uptime
