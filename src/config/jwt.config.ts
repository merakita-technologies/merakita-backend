import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export const jwtConfig = (configService: ConfigService): JwtModuleOptions => {
  const secret = configService.get<string>('JWT_SECRET');
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  const options: JwtModuleOptions = {
    secret: secret,
    signOptions: {
      expiresIn: '1d', // Default value
    },
  };

  // Override with environment variable if provided
  const envExpiresIn = configService.get<string>('JWT_EXPIRES_IN');
  if (envExpiresIn) {
    options.signOptions = {
      expiresIn: envExpiresIn as any, // Type assertion to bypass the type check
    };
  }

  return options;
};