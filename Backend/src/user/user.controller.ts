import {
  BadRequestException,
  ConflictException,
  Controller,
  Get,
  Patch,
  Post,
  Body,
  Param,
  Query,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('api/user')
export class UserController {
  constructor(@Inject(UserService) private readonly userService: UserService) {}

  @Get('stores')
  async getStores(@Query('search') search = '', @Query('userId') userId?: string) {
    const id = Number(userId);

    if (!Number.isInteger(id) || id <= 0) {
      throw new BadRequestException('A valid user ID is required.');
    }

    return this.userService.getStores(search, id);
  }

  @Post(':userId/stores/:storeUserId/rating')
  async saveRating(
    @Param('userId') userId: string,
    @Param('storeUserId') storeUserId: string,
    @Body() body: { rating?: number }
  ) {
    const normalUserId = Number(userId);
    const storeId = Number(storeUserId);
    const rating = Number(body.rating);

    if (!Number.isInteger(normalUserId) || normalUserId <= 0 || !Number.isInteger(storeId) || storeId <= 0) {
      throw new BadRequestException('Valid user and store IDs are required.');
    }

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      throw new BadRequestException('Rating must be a whole number between 1 and 5.');
    }

    return this.userService.saveRating(normalUserId, storeId, rating);
  }

  @Patch(':userId/password')
  async updatePassword(
    @Param('userId') userId: string,
    @Body() body: { currentPassword?: string; newPassword?: string }
  ) {
    const id = Number(userId);
    const { currentPassword, newPassword } = body;

    if (!Number.isInteger(id) || id <= 0 || !currentPassword || !newPassword) {
      throw new BadRequestException('A valid user ID, current password, and new password are required.');
    }

    const result = await this.userService.updatePassword(id, currentPassword, newPassword);
    if (!result.ok) {
      throw new UnauthorizedException(result.message);
    }

    return result;
  }

  @Patch(':userId/address')
  async updateAddress(@Param('userId') userId: string, @Body() body: { address?: string }) {
    const id = Number(userId);
    const address = body.address?.trim();

    if (!Number.isInteger(id) || id <= 0 || !address) {
      throw new BadRequestException('A valid user ID and address are required.');
    }

    return this.userService.updateAddress(id, address);
  }

  @Post('signup')
  async signup(@Body() body: { name?: string; email?: string; address?: string; password?: string }) {
    const { name, email, address, password } = body;

    if (!name || !email || !address || !password) {
      throw new BadRequestException('Name, email, address, and password are required.');
    }

    const result = await this.userService.signup({
      name,
      email,
      address,
      password,
    });

    if (!result.ok) {
      throw new ConflictException(result.message);
    }

    return result;
  }

  @Post('login')
  async login(@Body() body: { email?: string; password?: string }) {
    const { email, password } = body;

    if (!email || !password) {
      throw new BadRequestException('Email and password are required.');
    }

    const user = await this.userService.login({
      email,
      password,
    });

    if (!user) {
      throw new UnauthorizedException('Wrong password or invalid email.');
    }

    return {
      message: 'Login successful.',
      user,
    };
  }
}
