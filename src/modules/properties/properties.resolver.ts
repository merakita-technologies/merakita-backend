import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { PropertiesService } from './properties.service';
import { PropertyType, RoomUnitType } from './dto/graphql.dto';
import { Property } from './entities/property.entity';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Resolver(() => PropertyType)
export class PropertiesResolver {
  constructor(private propertiesService: PropertiesService) {}

  @Query(() => [PropertyType])
  async properties(
    @Args('city', { nullable: true }) city?: string,
    @Args('country', { nullable: true }) country?: string,
    @Args('propertyType', { nullable: true }) propertyType?: string,
    @Args('search', { nullable: true }) search?: string,
  ): Promise<PropertyType[]> {
    const properties = await this.propertiesService.findAll({
      city,
      country,
      propertyType,
      search,
    });

    return properties.map((p) => this.mapToPropertyType(p));
  }

  @Query(() => PropertyType, { nullable: true })
  async property(@Args('id') id: string): Promise<PropertyType | null> {
    const property = await this.propertiesService.findOne(id);
    if (!property) return null;
    return this.mapToPropertyType(property);
  }

  private mapToPropertyType(property: Property): PropertyType {
    return {
      id: property.id,
      name: property.name,
      address: property.address,
      city: property.city,
      country: property.country,
      description: property.description || '',
      propertyType: property.propertyType,
      rating: Number(property.rating),
      imageUrls: property.imageUrls || [],
      latitude: property.latitude ? Number(property.latitude) : undefined,
      longitude: property.longitude ? Number(property.longitude) : undefined,
      checkInTime: property.checkInTime || undefined,
      checkOutTime: property.checkOutTime || undefined,
      cancellationPolicy: property.cancellationPolicy || undefined,
      dynamicPricingEnabled: property.dynamicPricingEnabled,
      isActive: property.isActive,
      createdAt: property.createdAt,
      updatedAt: property.updatedAt,
      owner: property.owner
        ? {
            id: property.owner.id,
            email: property.owner.email,
            fullName: `${property.owner.firstName} ${property.owner.lastName}`,
          }
        : undefined,
      rooms: property.rooms
        ? property.rooms.map((room) => ({
            id: room.id,
            roomNumber: room.roomNumber,
            roomType: room.roomType,
            capacity: room.capacity,
            basePricePerNight: Number(room.basePricePerNight),
            description: room.description || undefined,
            images: room.images || [],
            isActive: room.isActive,
          }))
        : [],
    };
  }
}

