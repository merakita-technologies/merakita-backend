import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Property } from './entities/property.entity';
import { RoomUnit } from './entities/room-unit.entity';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectRepository(Property)
    private propertiesRepository: Repository<Property>,
    @InjectRepository(RoomUnit)
    private roomUnitsRepository: Repository<RoomUnit>,
  ) {}

  async findAll(filters?: {
    city?: string;
    country?: string;
    propertyType?: string;
    search?: string;
  }): Promise<Property[]> {
    const query = this.propertiesRepository
      .createQueryBuilder('property')
      .leftJoinAndSelect('property.owner', 'owner')
      .where('property.isActive = :isActive', { isActive: true });

    if (filters?.city) {
      query.andWhere('property.city = :city', { city: filters.city });
    }

    if (filters?.country) {
      query.andWhere('property.country = :country', { country: filters.country });
    }

    if (filters?.propertyType) {
      query.andWhere('property.propertyType = :propertyType', {
        propertyType: filters.propertyType,
      });
    }

    if (filters?.search) {
      query.andWhere(
        '(property.name ILIKE :search OR property.description ILIKE :search OR property.address ILIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    return await query.getMany();
  }

  async findOne(id: string): Promise<Property> {
    const property = await this.propertiesRepository.findOne({
      where: { id },
      relations: ['owner', 'rooms'],
    });

    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }

    return property;
  }

  async create(createPropertyDto: any, ownerId: string): Promise<Property> {
    const property = this.propertiesRepository.create({
      ...createPropertyDto,
      ownerId,
    });
    const saved = (await this.propertiesRepository.save(property)) as unknown as Property;
    return saved;
  }
}

