<?php

return [
    // Authentication
    'failed' => 'Kredensial ini tidak cocok dengan catatan kami.',
    'password' => 'Kata sandi yang diberikan salah.',
    'throttle' => 'Terlalu banyak percobaan login. Silakan coba lagi dalam :seconds detik.',

    // Registration
    'register' => [
        'success' => 'Pendaftaran berhasil! Silakan verifikasi email Anda.',
        'failed' => 'Pendaftaran gagal. Silakan coba lagi.',
    ],

    // Login
    'login' => [
        'success' => 'Login berhasil!',
        'failed' => 'Login gagal. Silakan periksa kredensial Anda.',
        'logout' => 'Logout berhasil!',
    ],

    // Password Reset
    'reset' => [
        'sent' => 'Kami telah mengirimkan tautan reset kata sandi ke email Anda!',
        'reset' => 'Kata sandi Anda telah direset!',
        'token' => 'Token reset kata sandi ini tidak valid.',
        'user' => 'Kami tidak dapat menemukan pengguna dengan alamat email tersebut.',
    ],

    // Email Verification
    'verification' => [
        'sent' => 'Tautan verifikasi baru telah dikirim ke alamat email Anda.',
        'verified' => 'Email Anda telah diverifikasi!',
    ],
];
