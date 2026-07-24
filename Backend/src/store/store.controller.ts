import {
  BadRequestException,
  ConflictException,
  Controller,
  Get,
  Patch,
  Post,
  Body,
  Param,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { StoreService } from './store.service';

@Controller('api/store')
export class StoreController {
  constructor(@Inject(StoreService) private readonly storeService: StoreService) {}

  @Patch(':storeUserId/password')
  async updatePassword(
    @Param('storeUserId') storeUserId: string,
    @Body() body: { currentPassword?: string; newPassword?: string }
  ) {
    const id = Number(storeUserId);
    if (!Number.isInteger(id) || id <= 0 || !body.currentPassword || !body.newPassword) {
      throw new BadRequestException('A valid store user ID, current password, and new password are required.');
    }

    const result = await this.storeService.updatePassword(id, body.currentPassword, body.newPassword);
    if (!result.ok) {
      throw new UnauthorizedException(result.message);
    }

    return result;
  }

  @Patch(':storeUserId/address')
  async updateAddress(@Param('storeUserId') storeUserId: string, @Body() body: { address?: string }) {
    const id = Number(storeUserId);
    const address = body.address?.trim();

    if (!Number.isInteger(id) || id <= 0 || !address) {
      throw new BadRequestException('A valid store user ID and store address are required.');
    }

    return this.storeService.updateAddress(id, address);
  }

  @Get(':storeUserId/dashboard')
  async getDashboard(@Param('storeUserId') storeUserId: string) {
    const id = Number(storeUserId);

    if (!Number.isInteger(id) || id <= 0) {
      throw new BadRequestException('A valid store user ID is required.');
    }

    return this.storeService.getDashboard(id);
  }

  @Post('signup')
  async signup(@Body() body: { storeName?: string; ownerName?: string; address?: string; email?: string; password?: string }) {
    const { storeName, ownerName, address, email, password } = body;

    if (!storeName || !ownerName || !address || !email || !password) {
      throw new BadRequestException('Store name, owner name, address, email, and password are required.');
    }

    const result = await this.storeService.signup({
      storeName,
      ownerName,
      address,
      email,
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

    const storeUser = await this.storeService.login({
      email,
      password,
    });

    if (!storeUser) {
      throw new UnauthorizedException('Wrong password or invalid email.');
    }

    return {
      message: 'Login successful.',
      user: storeUser,
    };
  }
}
