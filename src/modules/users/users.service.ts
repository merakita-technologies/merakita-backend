import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto, UpdateUserDto } from './dto/create-user.dto';
import { Repository, Like, ILike } from 'typeorm';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginationResult } from '../../common/interfaces/pagination.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const user = this.usersRepository.create(createUserDto);
    return await this.usersRepository.save(user);
  }

  async findAll(paginationDto: PaginationDto): Promise<PaginationResult<User>> {
    const { page, limit, skip, take } = paginationDto;

    const [data, total] = await this.usersRepository.findAndCount({
      where: { isActive: true },
      skip,
      take,
      order: { createdAt: 'DESC' },
      select: ['id', 'email', 'firstName', 'lastName', 'phoneNumber', 'loyaltyPoints', 'isActive', 'createdAt', 'updatedAt'], // Exclude password
    });

    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrevious = page > 1;

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNext,
        hasPrevious,
      },
    };
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ 
      where: { id },
      select: ['id', 'email', 'firstName', 'lastName', 'isActive', 'createdAt', 'updatedAt'] // Exclude password
    });
    
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOne({ 
      where: { email },
      select: ['id', 'email', 'password', 'firstName', 'lastName', 'phoneNumber', 'loyaltyPoints', 'isActive'] // Include password for auth
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, updateUserDto);
    return await this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.softRemove(user);
  }

  // Advanced search with pagination
  async searchUsers(
    search: string,
    pagination: { page: number; limit: number },
  ): Promise<PaginationResult<User>> {
    const skip = (pagination.page - 1) * pagination.limit;
    const take = pagination.limit;

    const [data, total] = await this.usersRepository.findAndCount({
      where: [
        { firstName: ILike(`%${search}%`) },
        { lastName: ILike(`%${search}%`) },
        { email: ILike(`%${search}%`) },
      ],
      skip,
      take,
      order: { createdAt: 'DESC' },
      select: ['id', 'email', 'firstName', 'lastName', 'isActive', 'createdAt', 'updatedAt'],
    });

    const totalPages = Math.ceil(total / pagination.limit);
    const hasNext = pagination.page < totalPages;
    const hasPrevious = pagination.page > 1;

    return {
      data,
      meta: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages,
        hasNext,
        hasPrevious,
      },
    };
  }
}