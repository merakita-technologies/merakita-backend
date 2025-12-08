# 🗄️ Database Setup Guide - Backend Manggon

Panduan lengkap untuk setup database baru untuk backend Manggon.

## 📋 Prerequisites

### 1. Install PostgreSQL

**Windows:**
1. Download dari: https://www.postgresql.org/download/windows/
2. Install dengan default settings
3. Ingat password yang dibuat untuk user `postgres`

**Mac:**
```bash
# Via Homebrew
brew install postgresql@15
brew services start postgresql@15
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 2. Verify PostgreSQL Installation

```bash
# Check PostgreSQL version
psql --version

# Check if PostgreSQL is running
# Windows: Check Services
# Mac/Linux:
sudo systemctl status postgresql
```

## 🔧 Setup Database

### Step 1: Create Database

**Via psql (Command Line):**

```bash
# Login ke PostgreSQL
psql -U postgres

# Atau dengan password
psql -U postgres -h localhost
```

Kemudian di psql prompt:
```sql
-- Create database
CREATE DATABASE manggon;

-- Create user (optional, bisa pakai postgres)
CREATE USER manggon_user WITH PASSWORD 'your_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE manggon TO manggon_user;

-- Exit
\q
```

**Via pgAdmin (GUI):**
1. Buka pgAdmin
2. Right-click pada "Databases" → Create → Database
3. Name: `manggon`
4. Owner: `postgres` (atau user yang dibuat)
5. Click Save

**Via Command Line (One-liner):**
```bash
# Windows (Command Prompt)
psql -U postgres -c "CREATE DATABASE manggon;"

# Mac/Linux
sudo -u postgres createdb manggon
```

### Step 2: Create .env File

Buat file `.env` di folder `backend/`:

```bash
cd backend
touch .env
```

Atau copy dari `.env.example` jika ada:
```bash
cp .env.example .env
```

### Step 3: Configure .env File

Edit file `.env` dengan konfigurasi database Anda:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_postgres_password
DB_DATABASE=manggon
DB_SYNCHRONIZE=true

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=1d

# Server Configuration
PORT=3010
NODE_ENV=development
```

**Penjelasan:**
- `DB_HOST`: Host PostgreSQL (biasanya `localhost`)
- `DB_PORT`: Port PostgreSQL (default `5432`)
- `DB_USERNAME`: Username PostgreSQL (default `postgres`)
- `DB_PASSWORD`: Password PostgreSQL yang dibuat saat install
- `DB_DATABASE`: Nama database yang dibuat (`manggon`)
- `DB_SYNCHRONIZE`: 
  - `true` untuk development (auto-create tables)
  - `false` untuk production (gunakan migrations)

### Step 4: Test Database Connection

```bash
# Test connection via psql
psql -U postgres -d manggon -h localhost

# Jika berhasil, akan masuk ke psql prompt
# Ketik \q untuk exit
```

## 🚀 Setup Backend dengan Database Baru

### Step 1: Install Dependencies

```bash
cd backend
pnpm install
```

### Step 2: Start Backend (Auto Create Tables)

Karena `DB_SYNCHRONIZE=true`, TypeORM akan otomatis create tables saat pertama kali start:

```bash
pnpm run start:dev
```

**Output yang diharapkan:**
```
[Nest] INFO  [TypeORM] Connected to database manggon
[Nest] INFO  [TypeORM] Synchronizing database schema...
[Nest] INFO  [TypeORM] Schema synchronization finished successfully.
```

### Step 3: Run Seed Data (Optional)

Untuk mengisi database dengan sample data:

```bash
pnpm run seed
```

**Output yang diharapkan:**
```
📦 Database connected, starting seed...
✅ Created test users
✅ Created properties
✅ Created room units
🎉 Seed data created successfully!

Test Credentials:
User: user@test.com / password123
Owner: owner@test.com / password123
```

## ✅ Verify Setup

### 1. Check Tables Created

```bash
psql -U postgres -d manggon -h localhost
```

```sql
-- List all tables
\dt

-- Check users table
SELECT * FROM users LIMIT 5;

-- Check properties table
SELECT * FROM properties LIMIT 5;

-- Exit
\q
```

### 2. Test Backend API

```bash
# Backend should be running
curl http://localhost:3010/graphql

# Or open in browser
# http://localhost:3010/graphql
```

### 3. Test Login

Di GraphQL Playground (`http://localhost:3010/graphql`):

```graphql
mutation {
  login(email: "user@test.com", password: "password123") {
    success
    token
    user {
      id
      email
      fullName
    }
  }
}
```

## 🔄 Reset Database (Jika Perlu)

### Option 1: Drop and Recreate

```sql
-- Connect to postgres database
psql -U postgres

-- Drop database
DROP DATABASE manggon;

-- Create new database
CREATE DATABASE manggon;

-- Exit
\q
```

Kemudian start backend lagi:
```bash
pnpm run start:dev
```

### Option 2: Drop All Tables

```sql
-- Connect to manggon database
psql -U postgres -d manggon

-- Drop all tables (HATI-HATI!)
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;

-- Exit
\q
```

Kemudian start backend lagi.

## 🛡️ Production Setup

Untuk production, gunakan konfigurasi berikut:

### .env (Production)

```env
# Database Configuration
DB_HOST=your-production-host
DB_PORT=5432
DB_USERNAME=your-production-user
DB_PASSWORD=your-secure-password
DB_DATABASE=manggon_prod
DB_SYNCHRONIZE=false  # IMPORTANT: false untuk production!

# JWT Configuration
JWT_SECRET=your-very-secure-secret-key-min-32-chars
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=3010
NODE_ENV=production
```

**PENTING untuk Production:**
- ✅ `DB_SYNCHRONIZE=false` - Jangan auto-sync di production
- ✅ Gunakan migrations untuk schema changes
- ✅ Gunakan strong password untuk database
- ✅ JWT_SECRET harus sangat aman dan panjang
- ✅ Jangan commit `.env` file ke git

## 📊 Database Schema

Setelah setup, database akan memiliki tables berikut:

- `users` - User accounts
- `properties` - Property listings
- `room_units` - Room units per property
- `bookings` - User bookings
- `payments` - Payment records
- `reviews` - Property reviews

## 🔍 Troubleshooting

### Error: "password authentication failed"

**Solusi:**
1. Cek password di `.env` file
2. Reset PostgreSQL password:
   ```bash
   # Windows: Edit pg_hba.conf
   # Mac/Linux:
   sudo -u postgres psql
   ALTER USER postgres PASSWORD 'new_password';
   ```

### Error: "database does not exist"

**Solusi:**
```bash
# Create database
psql -U postgres -c "CREATE DATABASE manggon;"
```

### Error: "connection refused"

**Solusi:**
1. Pastikan PostgreSQL running:
   ```bash
   # Windows: Check Services
   # Mac/Linux:
   sudo systemctl status postgresql
   sudo systemctl start postgresql
   ```

2. Cek port 5432 tidak digunakan aplikasi lain

### Error: "relation does not exist"

**Solusi:**
1. Pastikan `DB_SYNCHRONIZE=true` di `.env`
2. Restart backend: `pnpm run start:dev`
3. Atau run seed: `pnpm run seed`

### Error: "TypeORM connection error"

**Solusi:**
1. Cek semua config di `.env` file
2. Test connection manual: `psql -U postgres -d manggon`
3. Cek firewall tidak block port 5432

## 📝 Quick Reference

```bash
# Create database
psql -U postgres -c "CREATE DATABASE manggon;"

# Connect to database
psql -U postgres -d manggon

# List tables
\dt

# Describe table
\d users

# Exit psql
\q

# Run seed
cd backend
pnpm run seed

# Start backend
pnpm run start:dev
```

## ✅ Checklist Setup

- [ ] PostgreSQL installed
- [ ] Database `manggon` created
- [ ] `.env` file created dengan config yang benar
- [ ] Dependencies installed (`pnpm install`)
- [ ] Backend started (`pnpm run start:dev`)
- [ ] Tables created (check logs)
- [ ] Seed data run (`pnpm run seed`)
- [ ] Test connection via GraphQL Playground
- [ ] Test login dengan test credentials

## 🎉 Selesai!

Database sudah setup dan siap digunakan! 

Backend akan otomatis create tables saat pertama kali start dengan `DB_SYNCHRONIZE=true`.

**Test Credentials (setelah seed):**
- Email: `user@test.com`
- Password: `password123`

