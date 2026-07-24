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
import { AdminService } from './admin.service';

@Controller('api/admin')
export class AdminController {
  constructor(@Inject(AdminService) private readonly adminService: AdminService) {}

  @Get('stats')
  async getStats() {
    return this.adminService.getStats();
  }

  @Get('listings')
  async getListings(
    @Query('name') name = '',
    @Query('email') email = '',
    @Query('address') address = '',
    @Query('role') role = ''
  ) {
    return this.adminService.getListings({ name, email, address, role });
  }

  @Patch(':adminId/password')
  async updatePassword(
    @Param('adminId') adminId: string,
    @Body() body: { currentPassword?: string; newPassword?: string }
  ) {
    const id = Number(adminId);
    if (!Number.isInteger(id) || id <= 0 || !body.currentPassword || !body.newPassword) {
      throw new BadRequestException('A valid admin ID, current password, and new password are required.');
    }

    const result = await this.adminService.updatePassword(id, body.currentPassword, body.newPassword);
    if (!result.ok) {
      throw new UnauthorizedException(result.message);
    }

    return result;
  }

  @Post('signup')
  async signup(@Body() body: { username?: string; email?: string; password?: string }) {
    const { username, email, password } = body;

    if (!username || !email || !password) {
      throw new BadRequestException('Username, email, and password are required.');
    }

    const result = await this.adminService.signup({
      username,
      email,
      password,
    });

    if (!result.ok) {
      throw new ConflictException(result.message);
    }

    return result;
  }

  @Post('login')
  async login(@Body() body: { username?: string; password?: string }) {
    const { username, password } = body;

    if (!username || !password) {
      throw new BadRequestException('Username and password are required.');
    }

    const admin = await this.adminService.login({
      username,
      password,
    });

    if (!admin) {
      throw new UnauthorizedException('Wrong password or invalid username.');
    }

    return {
      message: 'Login successful.',
      user: admin,
    };
  }
}
