import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginInput, RegisterInput, LoginResponse, CreateUserResponse } from './dto/graphql.dto';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Public()
  @Mutation(() => LoginResponse, { name: 'login' })
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<LoginResponse> {
    const result = await this.authService.login({ email, password });
    
    return {
      success: true,
      message: 'Login successful',
      token: result.access_token,
      user: {
        id: result.user.id,
        email: result.user.email,
        fullName: `${result.user.firstName} ${result.user.lastName}`,
        phoneNumber: result.user.phoneNumber || undefined,
        loyaltyPoints: result.user.loyaltyPoints || 0,
      },
    };
  }

  @Public()
  @Mutation(() => CreateUserResponse, { name: 'createUser' })
  async createUser(
    @Args('input') input: RegisterInput,
  ): Promise<CreateUserResponse> {
    const result = await this.authService.register({
      email: input.email,
      password: input.password,
      firstName: input.fullName?.split(' ')[0] || input.fullName || '',
      lastName: input.fullName?.split(' ').slice(1).join(' ') || '',
      phoneNumber: input.phoneNumber,
    });

    return {
      success: true,
      message: 'User created successfully',
      user: {
        id: result.user.id,
        email: result.user.email,
        fullName: `${result.user.firstName} ${result.user.lastName}`,
        phoneNumber: result.user.phoneNumber || undefined,
        loyaltyPoints: result.user.loyaltyPoints || 0,
      },
    };
  }

  @Query(() => String)
  async me(@CurrentUser() user: any): Promise<string> {
    return `Authenticated as ${user.email}`;
  }
}

