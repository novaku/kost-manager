<?php

return [
    // Application-specific messages
    'kostan' => [
        'created' => 'Boarding house created successfully!',
        'updated' => 'Boarding house updated successfully!',
        'deleted' => 'Boarding house deleted successfully!',
        'not_found' => 'Boarding house not found.',
        'unauthorized' => 'You do not have access to this boarding house.',
    ],

    'room' => [
        'created' => 'Room created successfully!',
        'updated' => 'Room updated successfully!',
        'deleted' => 'Room deleted successfully!',
        'not_found' => 'Room not found.',
        'not_available' => 'Room is not available.',
        'already_rented' => 'Room is already rented.',
    ],

    'rental' => [
        'created' => 'Rental created successfully!',
        'updated' => 'Rental updated successfully!',
        'cancelled' => 'Rental cancelled successfully!',
        'not_found' => 'Rental not found.',
        'already_active' => 'You already have an active rental for this room.',
        'expired' => 'Rental has expired.',
        'payment_due' => 'Your payment is overdue.',
    ],

    'payment' => [
        'success' => 'Payment successful!',
        'failed' => 'Payment failed. Please try again.',
        'pending' => 'Payment is being processed.',
        'cancelled' => 'Payment cancelled.',
        'not_found' => 'Payment not found.',
        'already_paid' => 'Payment already made.',
        'insufficient_funds' => 'Insufficient funds.',
    ],

    'notification' => [
        'payment_reminder' => 'Reminder: Your rent payment is due on :date.',
        'payment_overdue' => 'Warning: Your rent payment is overdue. Please make payment immediately.',
        'payment_received' => 'Rent payment for :month has been received. Thank you!',
        'rental_approved' => 'Congratulations! Your rental application has been approved.',
        'rental_rejected' => 'Sorry, your rental application was rejected. Please try another room.',
        'rental_expired' => 'Your rental expires on :date. Please renew if you wish to continue.',
        'new_rental_request' => 'New rental request for room :room at :kostan boarding house.',
        'room_available' => 'Your favorite room is now available! Apply for rent before someone else takes it.',
    ],

    'errors' => [
        'server_error' => 'Server error occurred. Please try again later.',
        'not_found' => 'The page you are looking for was not found.',
        'unauthorized' => 'You do not have access to perform this action.',
        'forbidden' => 'Access denied.',
        'validation_failed' => 'The data you entered is invalid.',
        'file_too_large' => 'File size is too large.',
        'invalid_file_type' => 'File type is not supported.',
    ],

    'success' => [
        'data_saved' => 'Data saved successfully!',
        'data_updated' => 'Data updated successfully!',
        'data_deleted' => 'Data deleted successfully!',
        'email_sent' => 'Email sent successfully!',
        'profile_updated' => 'Profile updated successfully!',
        'password_changed' => 'Password changed successfully!',
    ],

    'general' => [
        'loading' => 'Loading...',
        'saving' => 'Saving...',
        'please_wait' => 'Please wait...',
        'try_again' => 'Try again',
        'contact_support' => 'Contact support',
        'no_data' => 'No data',
        'coming_soon' => 'Coming soon',
        'maintenance' => 'Under maintenance',
    ],
];
