# ⚡ Quick Database Setup

## 🚀 Setup Cepat (5 Menit)

### 1. Install PostgreSQL
- **Windows**: Download dari https://www.postgresql.org/download/windows/
- **Mac**: `brew install postgresql@15 && brew services start postgresql@15`
- **Linux**: `sudo apt install postgresql postgresql-contrib`

### 2. Create Database

```bash
# Login ke PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE manggon;

# Exit
\q
```

### 3. Create .env File

Buat file `.env` di folder `backend/`:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_postgres_password
DB_DATABASE=manggon
DB_SYNCHRONIZE=true

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=1d

# Server
PORT=3010
NODE_ENV=development
```

**Ganti:**
- `your_postgres_password` dengan password PostgreSQL Anda
- `your-super-secret-jwt-key` dengan secret key yang aman

### 4. Install & Start

```bash
cd backend

# Install dependencies
pnpm install

# Start backend (auto-create tables)
pnpm run start:dev

# Run seed data (optional)
pnpm run seed
```

## ✅ Verify

1. **Check tables created:**
   ```bash
   psql -U postgres -d manggon -c "\dt"
   ```

2. **Test GraphQL:**
   - Buka: http://localhost:3010/graphql
   - Test login: `user@test.com` / `password123`

## 🔧 Troubleshooting

**Error: "password authentication failed"**
- Cek password di `.env` file

**Error: "database does not exist"**
- Run: `psql -U postgres -c "CREATE DATABASE manggon;"`

**Error: "connection refused"**
- Pastikan PostgreSQL running
- Windows: Check Services
- Mac/Linux: `sudo systemctl start postgresql`

## 📖 Lihat `DATABASE_SETUP.md` untuk panduan lengkap

