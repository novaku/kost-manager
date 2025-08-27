# Database Seeder Documentation

## Overview
Database seeder lengkap untuk aplikasi Kost Manager yang menyediakan data contoh untuk semua fitur aplikasi.

## Seeder yang Tersedia

### 1. DatabaseSeeder (Main Seeder)
File: `database/seeders/DatabaseSeeder.php`

Seeder utama yang menjalankan semua seeder lainnya secara berurutan dan menciptakan data yang saling terkait.

**Data yang dibuat:**
- 4 pemilik kost (owners) termasuk admin
- 20 penyewa (tenants) termasuk test user
- 6-12 kostan dengan berbagai fasilitas
- 8-15 kamar per kostan dengan status berbeda
- Rental agreement aktif, pending, dan expired
- Payment history yang realistis
- Review dan rating untuk setiap kostan

### 2. UserSeeder
File: `database/seeders/UserSeeder.php`

Membuat user dengan berbagai role dan data lengkap.

### 3. KostanSeeder  
File: `database/seeders/KostanSeeder.php`

Membuat data kostan untuk setiap owner.

## Factory yang Tersedia

### 1. UserFactory
- Role: owner/tenant
- Data lengkap: nama, email, phone, alamat, dll
- Profile image placeholder

### 2. KostanFactory
- Nama dan deskripsi realistis
- Lokasi di kota-kota besar Indonesia
- Fasilitas lengkap (WiFi, AC, parkir, dll)
- Aturan-aturan kost
- Rating dan review count

### 3. RoomFactory
- Tipe kamar: single, shared, studio, apartment
- Harga sesuai tipe kamar
- Status: available, occupied, maintenance
- Fasilitas kamar lengkap
- Nomor kamar unik per kostan

### 4. RentalFactory
- Status: active, pending, expired, terminated
- Rental period 12 bulan
- Terms and conditions
- Auto renewal options

### 5. PaymentFactory
- Tipe: monthly_rent, deposit, late_fee, utility, other
- Status: completed, pending, failed, cancelled
- Payment gateway integration
- Receipt URLs untuk payment yang berhasil

### 6. ReviewFactory
- Rating 1-5 dengan komentar sesuai rating
- Rating details (kebersihan, keamanan, dll)
- Status published/unpublished
- Unique constraint per kostan-tenant

## Cara Menjalankan Seeder

### Menjalankan Semua Seeder
```bash
php artisan migrate:fresh --seed
```

### Menjalankan Seeder Spesifik
```bash
php artisan db:seed --class=UserSeeder
php artisan db:seed --class=KostanSeeder
```

## Test Accounts

Setelah seeder dijalankan, tersedia akun test berikut:

**Owner Account:**
- Email: owner@example.com
- Password: password
- Role: owner

**Tenant Account:**
- Email: tenant@example.com  
- Password: password
- Role: tenant

## Data Summary

Setelah seeder selesai, database akan berisi:
- ±24 users (4 owners, 20 tenants)
- ±6-12 kostans
- ±80-100 rooms
- ±30-40 rentals (mix of active, pending, expired)
- ±120-150 payments (mix of completed, pending)
- ±40-50 reviews (mostly published)

## Struktur Data untuk Halaman Frontend

### DashboardPage
- Data statistik dari rentals dan payments
- Recent activities dari berbagai model

### HomePage & KostanListPage
- Daftar kostan dengan rating dan foto
- Filter berdasarkan lokasi, harga, fasilitas

### KostanDetailPage
- Detail kostan lengkap dengan fasilitas
- Daftar kamar dengan availability
- Reviews dan rating
- Galeri foto

### MyKostansPage (Owner)
- Kostan yang dimiliki owner
- Statistik occupancy dan revenue

### MyRentalsPage (Tenant)
- Rental history dan status
- Current rental details

### PaymentsPage
- Payment history dengan status
- Upcoming payments
- Payment receipts

### ProfilePage
- User profile data lengkap
- Edit profile functionality

### LoginPage & RegisterPage
- Authentication dengan test accounts

## Tips Penggunaan

1. **Konsistensi Data**: Seeder memastikan relasi antar tabel konsisten
2. **Realistic Data**: Menggunakan data yang mirip dengan kondisi real
3. **Test Coverage**: Mencakup berbagai skenario (success, pending, failed)
4. **Performance**: Menggunakan chunk dan batch insert untuk performa optimal

## Customization

Untuk mengubah jumlah data yang dibuat, edit konstanta di `DatabaseSeeder.php`:
- Jumlah owners: ubah parameter di `User::factory(3)->owner()`
- Jumlah tenants: ubah parameter di `User::factory(19)->tenant()`
- Kostan per owner: ubah `rand(1, 3)` di loop kostans
- Rooms per kostan: ubah `rand(8, 15)` di loop rooms

## Maintenance

Seeder akan otomatis menyesuaikan dengan perubahan struktur database. Jika ada perubahan migration, pastikan untuk:
1. Update factory sesuai dengan kolom baru
2. Update seeder jika ada constraint baru
3. Test ulang seeder setelah perubahan
