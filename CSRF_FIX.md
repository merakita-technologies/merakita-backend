# 🔧 CSRF Protection Fix

## Masalah

Error saat test connection:
```json
{
  "errors": [{
    "message": "This operation has been blocked as a potential Cross-Site Request Forgery (CSRF)...",
    "code": "BAD_REQUEST"
  }]
}
```

## ✅ Solusi

### 1. Disable CSRF Protection (Development)

File: `backend/src/app.module.ts`

```typescript
GraphQLModule.forRoot<ApolloDriverConfig>({
  // ... other config
  csrfPrevention: false, // Disable CSRF for mobile app compatibility
  // ... rest of config
})
```

### 2. Mobile App Already Sends Correct Headers

File: `mobile/lib/services/graphql_config.dart`

Mobile app sudah mengirim:
- `Content-Type: application/json` ✅
- `Authorization: JWT <token>` (jika ada) ✅

## 🧪 Test

### Test dari Command Line:
```bash
# Test dengan header yang benar
curl -X POST http://192.168.1.4:3010/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"query { __typename }"}'
```

### Test dari Mobile App:
1. Restart backend: `cd backend && pnpm run start:dev`
2. Rebuild mobile app: `cd mobile && flutter run`
3. Coba login

## ⚠️ Production Note

Untuk production, sebaiknya enable CSRF protection dengan konfigurasi yang tepat:

```typescript
csrfPrevention: {
  requestHeaders: ['Content-Type'],
  // Allow specific origins
}
```

Atau gunakan proper authentication dan CORS configuration.

## ✅ Status

- [x] CSRF protection disabled untuk development
- [x] Mobile app mengirim header yang benar
- [x] Backend bisa diakses dari network
- [ ] Test connection berhasil

