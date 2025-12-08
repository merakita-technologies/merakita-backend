import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { Property } from '../properties/entities/property.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewsRepository: Repository<Review>,
    @InjectRepository(Property)
    private propertiesRepository: Repository<Property>,
  ) {}

  async create(createReviewDto: any, userId: string): Promise<Review> {
    const property = await this.propertiesRepository.findOne({
      where: { id: createReviewDto.propertyId },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    const review = this.reviewsRepository.create({
      ...createReviewDto,
      userId,
      reviewDate: new Date(),
    });

    const saved = (await this.reviewsRepository.save(review)) as unknown as Review;
    return saved;
  }

  async findByProperty(propertyId: string): Promise<Review[]> {
    return await this.reviewsRepository.find({
      where: { propertyId, isPublic: true },
      relations: ['user'],
      order: { reviewDate: 'DESC' },
    });
  }
}

