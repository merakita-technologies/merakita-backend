import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ReviewsService } from './reviews.service';
import { ReviewInput, ReviewType, CreateReviewResponse } from './dto/graphql.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Resolver(() => ReviewType)
export class ReviewsResolver {
  constructor(private reviewsService: ReviewsService) {}

  @Mutation(() => CreateReviewResponse)
  async createReview(
    @Args('input') input: ReviewInput,
    @CurrentUser() user: any,
  ): Promise<CreateReviewResponse> {
    try {
      const review = await this.reviewsService.create(input, user.id);
      return {
        success: true,
        message: 'Review created successfully',
        review: this.mapToReviewType(review),
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to create review',
        review: undefined,
      };
    }
  }

  @Query(() => [ReviewType])
  async propertyReviews(@Args('propertyId') propertyId: string): Promise<ReviewType[]> {
    const reviews = await this.reviewsService.findByProperty(propertyId);
    return reviews.map((r) => this.mapToReviewType(r));
  }

  private mapToReviewType(review: any): ReviewType {
    return {
      id: review.id,
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      reviewDate: review.reviewDate,
      isVerified: review.isVerified,
      helpfulVotes: review.helpfulVotes,
      isPublic: review.isPublic,
      user: review.user
        ? {
            id: review.user.id,
            email: review.user.email,
            fullName: `${review.user.firstName} ${review.user.lastName}`,
          }
        : undefined,
      property: review.property
        ? {
            id: review.property.id,
            name: review.property.name,
            city: review.property.city,
            country: review.property.country,
          }
        : undefined,
    };
  }
}

