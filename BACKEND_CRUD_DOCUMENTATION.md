# Backend CRUD Operations - Complete Documentation

## 📁 Struktur Backend

```
backend/
├── src/
│   ├── modules/
│   │   ├── auth/              # Authentication Module
│   │   ├── users/             # Users Module
│   │   ├── properties/        # Properties Module
│   │   ├── bookings/          # Bookings Module
│   │   ├── payments/          # Payments Module
│   │   └── reviews/           # Reviews Module
│   ├── common/                # Shared utilities
│   ├── config/                # Configuration files
│   └── database/
│       └── seeds/             # Database seed scripts
```

## 🔐 1. Authentication Module

### Files
- `auth.module.ts` - Module definition
- `auth.service.ts` - Business logic
- `auth.controller.ts` - REST API endpoints
- `auth.resolver.ts` - GraphQL resolvers
- `dto/auth.dto.ts` - REST DTOs
- `dto/graphql.dto.ts` - GraphQL DTOs
- `strategies/jwt.strategy.ts` - JWT authentication strategy

### GraphQL Resolvers

#### `login` Mutation
```typescript
@Public()
@Mutation(() => LoginResponse, { name: 'login' })
async login(
  @Args('email') email: string,
  @Args('password') password: string,
): Promise<LoginResponse>
```

**Input:**
- `email: string` - User email
- `password: string` - User password

**Output:**
```typescript
{
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    email: string;
    fullName: string;
    phoneNumber?: string;
    loyaltyPoints?: number;
  };
}
```

#### `createUser` Mutation
```typescript
@Public()
@Mutation(() => CreateUserResponse, { name: 'createUser' })
async createUser(
  @Args('input') input: RegisterInput,
): Promise<CreateUserResponse>
```

**Input:**
```typescript
{
  email: string;
  password: string;
  fullName?: string;
  phoneNumber?: string;
}
```

**Output:**
```typescript
{
  success: boolean;
  message: string;
  user?: UserType;
}
```

#### `me` Query
```typescript
@Query(() => String)
async me(@CurrentUser() user: any): Promise<string>
```

### REST Endpoints

- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login

### Service Methods

```typescript
// auth.service.ts
async register(registerDto: RegisterDto): Promise<{ access_token: string; user: User }>
async login(loginDto: LoginDto): Promise<{ access_token: string; user: User }>
```

## 🏨 2. Properties Module

### Files
- `properties.module.ts` - Module definition
- `properties.service.ts` - Business logic
- `properties.resolver.ts` - GraphQL resolvers
- `dto/graphql.dto.ts` - GraphQL DTOs
- `entities/property.entity.ts` - Property entity
- `entities/room-unit.entity.ts` - Room unit entity

### GraphQL Resolvers

#### `properties` Query
```typescript
@Query(() => [PropertyType])
async properties(
  @Args('city', { nullable: true }) city?: string,
  @Args('country', { nullable: true }) country?: string,
  @Args('propertyType', { nullable: true }) propertyType?: string,
  @Args('search', { nullable: true }) search?: string,
): Promise<PropertyType[]>
```

**Filters:**
- `city?: string` - Filter by city
- `country?: string` - Filter by country
- `propertyType?: string` - Filter by property type (hotel, resort, villa, apartment)
- `search?: string` - Search in name, description, address

**Output:**
```typescript
PropertyType[] {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  description?: string;
  propertyType: string;
  rating: number;
  imageUrls?: string[];
  latitude?: number;
  longitude?: number;
  checkInTime?: string;
  checkOutTime?: string;
  cancellationPolicy?: string;
  dynamicPricingEnabled: boolean;
  isActive: boolean;
  owner?: UserOwnerType;
}
```

#### `property` Query
```typescript
@Query(() => PropertyType, { nullable: true })
async property(@Args('id') id: string): Promise<PropertyType | null>
```

**Output:** Same as `properties` but includes `rooms` array:
```typescript
{
  ...PropertyType,
  rooms?: RoomUnitType[] {
    id: string;
    roomNumber: string;
    roomType: string;
    capacity: number;
    basePricePerNight: number;
    description?: string;
    images?: string[];
    isActive: boolean;
  }
}
```

### Service Methods

```typescript
// properties.service.ts
async findAll(filters?: {
  city?: string;
  country?: string;
  propertyType?: string;
  search?: string;
}): Promise<Property[]>

async findOne(id: string): Promise<Property>

async create(createPropertyDto: any, ownerId: string): Promise<Property>
```

### Entities

#### Property Entity
```typescript
@Entity('properties')
export class Property extends BaseEntity {
  name: string;
  address: string;
  city: string;
  country: string;
  description?: string;
  propertyType: string;
  rating: number;
  imageUrls?: string[];
  latitude?: number;
  longitude?: number;
  checkInTime?: string;
  checkOutTime?: string;
  cancellationPolicy?: string;
  dynamicPricingEnabled: boolean;
  isActive: boolean;
  owner: User;
  rooms: RoomUnit[];
}
```

#### RoomUnit Entity
```typescript
@Entity('room_units')
export class RoomUnit extends BaseEntity {
  roomNumber: string;
  roomType: string;
  capacity: number;
  basePricePerNight: number;
  description?: string;
  images?: string[];
  isActive: boolean;
  property: Property;
  bookings: Booking[];
}
```

## 📅 3. Bookings Module

### Files
- `bookings.module.ts` - Module definition
- `bookings.service.ts` - Business logic
- `bookings.resolver.ts` - GraphQL resolvers
- `dto/graphql.dto.ts` - GraphQL DTOs
- `entities/booking.entity.ts` - Booking entity
- `entities/payment.entity.ts` - Payment entity

### GraphQL Resolvers

#### `createBooking` Mutation
```typescript
@Mutation(() => CreateBookingResponse)
async createBooking(
  @Args('input') input: BookingInput,
  @CurrentUser() user: any,
): Promise<CreateBookingResponse>
```

**Input:**
```typescript
{
  roomUnitId: string;
  checkInDate: string;      // Format: YYYY-MM-DD
  checkOutDate: string;     // Format: YYYY-MM-DD
  guestNames?: string[];
  specialRequests?: string;
  addOnIds?: string[];
}
```

**Output:**
```typescript
{
  success: boolean;
  message: string;
  booking?: BookingType {
    id: string;
    checkInDate: string;
    checkOutDate: string;
    guestNames?: string[];
    specialRequests?: string;
    totalPrice: number;
    status: string;          // 'pending' | 'confirmed' | 'cancelled' | 'completed'
    bookingDate: Date;
    durationNights: number;
    isActive: boolean;
    user?: BookingUserType;
    roomUnit?: BookingRoomUnitType;
    property?: BookingPropertyType;
    payment?: PaymentType;
  };
}
```

**Note:** Payment otomatis dibuat dengan status `pending` saat booking dibuat.

#### `myBookings` Query
```typescript
@Query(() => [BookingType])
async myBookings(
  @Args('status', { nullable: true }) status: string,
  @CurrentUser() user: any,
): Promise<BookingType[]>
```

**Filters:**
- `status?: string` - Filter by status (pending, confirmed, cancelled, completed)

**Output:** Array of `BookingType`

### Service Methods

```typescript
// bookings.service.ts
async create(createBookingDto: any, userId: string): Promise<Booking>
async findByUser(userId: string, status?: string): Promise<Booking[]>
```

**Business Logic:**
- Validates room unit exists
- Validates check-in/check-out dates
- Calculates duration in nights
- Calculates total price (basePricePerNight × durationNights)
- Creates payment record with status 'pending'
- Sets booking status to 'pending'

### Entities

#### Booking Entity
```typescript
@Entity('bookings')
export class Booking extends BaseEntity {
  checkInDate: Date;
  checkOutDate: Date;
  guestNames?: string[];
  specialRequests?: string;
  totalPrice: number;
  status: string;
  bookingDate: Date;
  durationNights: number;
  isActive: boolean;
  user: User;
  roomUnit: RoomUnit;
  property: Property;
  payment?: Payment;
}
```

## 💳 4. Payments Module

### Files
- `payments.module.ts` - Module definition
- `payments.service.ts` - Business logic
- `payments.resolver.ts` - GraphQL resolvers
- `dto/graphql.dto.ts` - GraphQL DTOs

### GraphQL Resolvers

#### `confirmPayment` Mutation
```typescript
@Mutation(() => ConfirmPaymentResponse)
async confirmPayment(
  @Args('paymentId') paymentId: string,
  @Args('paymentMethod') paymentMethod: string,
  @CurrentUser() user: any,
): Promise<ConfirmPaymentResponse>
```

**Input:**
- `paymentId: string` - Payment ID
- `paymentMethod: string` - Payment method (e.g., 'credit_card', 'bank_transfer', 'e_wallet')

**Output:**
```typescript
{
  success: boolean;
  message: string;
  payment?: PaymentType {
    id: string;
    amount: number;
    status: string;          // 'paid' after confirmation
    paymentMethod?: string;
  };
}
```

**Business Logic:**
- Validates payment exists
- Validates payment belongs to user
- Validates payment not already paid
- Updates payment status to 'paid'
- Updates booking status to 'confirmed'

#### `getPaymentByBooking` Query
```typescript
@Query(() => PaymentType, { name: 'getPaymentByBooking' })
async getPaymentByBooking(
  @Args('bookingId') bookingId: string,
  @CurrentUser() user: any,
): Promise<PaymentType>
```

**Input:**
- `bookingId: string` - Booking ID

**Output:** `PaymentType`

### Service Methods

```typescript
// payments.service.ts
async confirmPayment(
  paymentId: string,
  paymentMethod: string,
  userId: string
): Promise<Payment>

async getPaymentByBookingId(
  bookingId: string,
  userId: string
): Promise<Payment>
```

### Payment Entity
```typescript
@Entity('payments')
export class Payment extends BaseEntity {
  amount: number;
  status: string;            // 'pending' | 'paid' | 'failed' | 'refunded'
  paymentMethod?: string;
  booking: Booking;
}
```

## ⭐ 5. Reviews Module

### Files
- `reviews.module.ts` - Module definition
- `reviews.service.ts` - Business logic
- `reviews.resolver.ts` - GraphQL resolvers
- `dto/graphql.dto.ts` - GraphQL DTOs
- `entities/review.entity.ts` - Review entity

### GraphQL Resolvers

#### `createReview` Mutation
```typescript
@Mutation(() => CreateReviewResponse)
async createReview(
  @Args('input') input: ReviewInput,
  @CurrentUser() user: any,
): Promise<CreateReviewResponse>
```

**Input:**
```typescript
{
  bookingId: string;
  propertyId: string;
  rating: number;            // 1-5
  title: string;
  comment: string;
  isPublic?: boolean;        // Default: true
}
```

**Output:**
```typescript
{
  success: boolean;
  message: string;
  review?: ReviewType {
    id: string;
    rating: number;
    title: string;
    comment: string;
    reviewDate: Date;
    isVerified: boolean;
    helpfulVotes: number;
    isPublic: boolean;
    user?: ReviewUserType;
    property?: ReviewPropertyType;
  };
}
```

#### `propertyReviews` Query
```typescript
@Query(() => [ReviewType])
async propertyReviews(
  @Args('propertyId') propertyId: string
): Promise<ReviewType[]>
```

**Output:** Array of `ReviewType` (only public reviews)

### Service Methods

```typescript
// reviews.service.ts
async create(createReviewDto: any, userId: string): Promise<Review>
async findByProperty(propertyId: string): Promise<Review[]>
```

### Review Entity
```typescript
@Entity('reviews')
export class Review extends BaseEntity {
  rating: number;            // 1-5
  title: string;
  comment: string;
  reviewDate: Date;
  isVerified: boolean;
  helpfulVotes: number;
  isPublic: boolean;
  user: User;
  property: Property;
  booking?: Booking;
}
```

## 🔧 Common Utilities

### Decorators

#### `@Public()` - Skip authentication
```typescript
// common/decorators/public.decorator.ts
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
```

#### `@CurrentUser()` - Get current authenticated user
```typescript
// common/decorators/current-user.decorator.ts
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    // Supports both GraphQL and HTTP contexts
    const gqlCtx = GqlExecutionContext.create(ctx);
    if (gqlCtx) {
      return gqlCtx.getContext().req?.user;
    }
    return ctx.switchToHttp().getRequest()?.user;
  },
);
```

### Guards

#### `JwtAuthGuard` - JWT Authentication Guard
```typescript
// common/guards/jwt-auth.guard.ts
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // Supports GraphQL and HTTP contexts
  // Respects @Public() decorator
}
```

**JWT Token Formats Supported:**
- `Authorization: Bearer <token>`
- `Authorization: JWT <token>`
- Cookie: `JWT=<token>` or `token=<token>`

## 📊 Database Seeding

### Seed Script

**File:** `src/database/seeds/seed.ts`

**Run:**
```bash
pnpm run seed
```

**Creates:**
- 2 test users (user@test.com, owner@test.com)
- 5 properties in different cities
- Multiple room units per property (2-4 rooms each)

**Test Credentials:**
- User: `user@test.com` / `password123`
- Owner: `owner@test.com` / `password123`

## 🔄 Complete Flow Example

### 1. User Registration
```graphql
mutation {
  createUser(input: {
    email: "newuser@example.com"
    password: "password123"
    fullName: "John Doe"
    phoneNumber: "+6281234567890"
  }) {
    success
    message
    user {
      id
      email
      fullName
    }
  }
}
```

### 2. User Login
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

### 3. Browse Properties
```graphql
query {
  properties(city: "Jakarta", propertyType: "hotel") {
    id
    name
    address
    city
    rating
    imageUrls
    latitude
    longitude
  }
}
```

### 4. Get Property Details
```graphql
query {
  property(id: "property-uuid") {
    id
    name
    description
    rooms {
      id
      roomNumber
      roomType
      capacity
      basePricePerNight
    }
  }
}
```

### 5. Create Booking
```graphql
mutation {
  createBooking(input: {
    roomUnitId: "room-uuid"
    checkInDate: "2025-12-15"
    checkOutDate: "2025-12-20"
    guestNames: ["John Doe"]
    specialRequests: "Early check-in please"
  }) {
    success
    message
    booking {
      id
      totalPrice
      status
      payment {
        id
        amount
        status
      }
    }
  }
}
```

### 6. Confirm Payment
```graphql
mutation {
  confirmPayment(
    paymentId: "payment-uuid"
    paymentMethod: "credit_card"
  ) {
    success
    message
    payment {
      id
      status
      paymentMethod
    }
  }
}
```

### 7. Get My Bookings
```graphql
query {
  myBookings(status: "confirmed") {
    id
    checkInDate
    checkOutDate
    totalPrice
    status
    property {
      name
      city
    }
    payment {
      status
      paymentMethod
    }
  }
}
```

### 8. Create Review
```graphql
mutation {
  createReview(input: {
    bookingId: "booking-uuid"
    propertyId: "property-uuid"
    rating: 5
    title: "Excellent stay!"
    comment: "Great service and location"
    isPublic: true
  }) {
    success
    message
    review {
      id
      rating
      title
      comment
    }
  }
}
```

## 🛡️ Error Handling

All mutations return consistent error format:
```typescript
{
  success: boolean;
  message: string;
  data?: any;  // null/undefined on error
}
```

Common errors:
- `NotFoundException` - Resource not found
- `BadRequestException` - Invalid input
- `UnauthorizedException` - Authentication required
- `ConflictException` - Resource already exists

## 📝 Environment Variables

Required in `.env`:
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=manggon
DB_SYNCHRONIZE=false

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=1d
```

## 🚀 Running the Backend

```bash
# Install dependencies
pnpm install

# Run seed data
pnpm run seed

# Start development server
pnpm run start:dev

# Build for production
pnpm run build
pnpm run start:prod
```

## 📍 Endpoints

- **GraphQL**: `http://localhost:3010/graphql`
- **REST API**: `http://localhost:3010/api/v1`
- **Swagger Docs**: `http://localhost:3010/api/docs`

## ✅ All CRUD Operations Summary

| Module | Create | Read | Update | Delete |
|--------|--------|------|--------|--------|
| Auth | ✅ createUser | ✅ me | - | - |
| Properties | ✅ (service) | ✅ properties, property | - | - |
| Bookings | ✅ createBooking | ✅ myBookings | - | - |
| Payments | ✅ (auto on booking) | ✅ getPaymentByBooking | ✅ confirmPayment | - |
| Reviews | ✅ createReview | ✅ propertyReviews | - | - |

Semua kode backend sudah lengkap dan siap digunakan! 🎉

