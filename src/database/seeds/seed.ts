import { DataSource } from 'typeorm';
import { User } from '../../modules/users/entities/user.entity';
import { Property } from '../../modules/properties/entities/property.entity';
import { RoomUnit } from '../../modules/properties/entities/room-unit.entity';
import * as bcrypt from 'bcrypt';

export async function seedDatabase(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(User);
  const propertyRepository = dataSource.getRepository(Property);
  const roomUnitRepository = dataSource.getRepository(RoomUnit);

  // Create test users
  // Check if users already exist
  let savedUser = await userRepository.findOne({
    where: { email: 'user@test.com' },
  });
  let savedOwner = await userRepository.findOne({
    where: { email: 'owner@test.com' },
  });

  // Only create if they don't exist
  if (!savedUser) {
    const hashedPassword = await bcrypt.hash('password123', 10);
    // Use query builder to insert directly and skip BeforeInsert hook
    // This prevents double hashing (seed already hashes, hook would hash again)
    await userRepository
      .createQueryBuilder()
      .insert()
      .into(User)
      .values({
        email: 'user@test.com',
        password: hashedPassword,
        firstName: 'John',
        lastName: 'Doe',
        isActive: true,
      })
      .execute();

    savedUser = await userRepository.findOne({
      where: { email: 'user@test.com' },
    });
  }

  if (!savedOwner) {
    const hashedPassword = await bcrypt.hash('password123', 10);
    await userRepository
      .createQueryBuilder()
      .insert()
      .into(User)
      .values({
        email: 'owner@test.com',
        password: hashedPassword,
        firstName: 'Jane',
        lastName: 'Smith',
        isActive: true,
      })
      .execute();

    savedOwner = await userRepository.findOne({
      where: { email: 'owner@test.com' },
    });
  }

  if (!savedUser || !savedOwner) {
    throw new Error('Failed to create test users');
  }

  console.log('✅ Created test users');

  // Create properties
  const properties = [
    {
      name: 'Grand Hotel Jakarta',
      address: 'Jl. Thamrin No. 1',
      city: 'Jakarta',
      country: 'Indonesia',
      description: 'Luxury hotel in the heart of Jakarta with modern amenities and excellent service.',
      propertyType: 'hotel',
      rating: 4.5,
      imageUrls: [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
      ],
      latitude: -6.2088,
      longitude: 106.8456,
      checkInTime: '14:00',
      checkOutTime: '12:00',
      cancellationPolicy: 'Free cancellation up to 24 hours before check-in',
      dynamicPricingEnabled: true,
      isActive: true,
      ownerId: savedOwner.id,
    },
    {
      name: 'Beach Resort Bali',
      address: 'Jl. Pantai Kuta No. 88',
      city: 'Bali',
      country: 'Indonesia',
      description: 'Beautiful beachfront resort with stunning ocean views and tropical gardens.',
      propertyType: 'resort',
      rating: 4.8,
      imageUrls: [
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
        'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800',
      ],
      latitude: -8.7222,
      longitude: 115.1725,
      checkInTime: '15:00',
      checkOutTime: '11:00',
      cancellationPolicy: 'Free cancellation up to 48 hours before check-in',
      dynamicPricingEnabled: true,
      isActive: true,
      ownerId: savedOwner.id,
    },
    {
      name: 'Mountain View Villa',
      address: 'Jl. Raya Puncak No. 123',
      city: 'Bogor',
      country: 'Indonesia',
      description: 'Cozy villa with mountain views, perfect for family getaway.',
      propertyType: 'villa',
      rating: 4.3,
      imageUrls: [
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
      ],
      latitude: -6.7156,
      longitude: 106.9542,
      checkInTime: '14:00',
      checkOutTime: '12:00',
      cancellationPolicy: 'Free cancellation up to 7 days before check-in',
      dynamicPricingEnabled: false,
      isActive: true,
      ownerId: savedOwner.id,
    },
    {
      name: 'City Apartment Bandung',
      address: 'Jl. Dago No. 45',
      city: 'Bandung',
      country: 'Indonesia',
      description: 'Modern apartment in central Bandung, close to shopping and dining.',
      propertyType: 'apartment',
      rating: 4.2,
      imageUrls: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
      ],
      latitude: -6.9175,
      longitude: 107.6191,
      checkInTime: '14:00',
      checkOutTime: '11:00',
      cancellationPolicy: 'Free cancellation up to 24 hours before check-in',
      dynamicPricingEnabled: true,
      isActive: true,
      ownerId: savedOwner.id,
    },
    {
      name: 'Luxury Suite Yogyakarta',
      address: 'Jl. Malioboro No. 1',
      city: 'Yogyakarta',
      country: 'Indonesia',
      description: 'Elegant suite in historic Yogyakarta, combining traditional and modern design.',
      propertyType: 'hotel',
      rating: 4.6,
      imageUrls: [
        'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800',
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800',
      ],
      latitude: -7.7956,
      longitude: 110.3695,
      checkInTime: '14:00',
      checkOutTime: '12:00',
      cancellationPolicy: 'Free cancellation up to 24 hours before check-in',
      dynamicPricingEnabled: true,
      isActive: true,
      ownerId: savedOwner.id,
    },
  ];

  const savedProperties: Property[] = [];
  for (const propData of properties) {
    const property = propertyRepository.create(propData);
    const saved = await propertyRepository.save(property);
    savedProperties.push(saved);
  }

  console.log('✅ Created properties');

  // Create room units for each property
  const roomTypes = [
    { type: 'single', capacity: 1, price: 300000 },
    { type: 'double', capacity: 2, price: 500000 },
    { type: 'suite', capacity: 4, price: 1000000 },
    { type: 'deluxe', capacity: 2, price: 750000 },
  ];

  for (const property of savedProperties) {
    // Create 2-4 rooms per property
    const numRooms = Math.floor(Math.random() * 3) + 2;
    for (let i = 1; i <= numRooms; i++) {
      const roomType = roomTypes[Math.floor(Math.random() * roomTypes.length)];
      const room = roomUnitRepository.create({
        roomNumber: `${property.name.substring(0, 3).toUpperCase()}-${i.toString().padStart(3, '0')}`,
        roomType: roomType.type,
        capacity: roomType.capacity,
        basePricePerNight: roomType.price,
        description: `Comfortable ${roomType.type} room with modern amenities`,
        images: [
          'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
          'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800',
        ],
        isActive: true,
        propertyId: property.id,
      });
      await roomUnitRepository.save(room);
    }
  }

  console.log('✅ Created room units');
  console.log('\n🎉 Seed data created successfully!');
  console.log('\nTest Credentials:');
  console.log('User: user@test.com / password123');
  console.log('Owner: owner@test.com / password123');
}

