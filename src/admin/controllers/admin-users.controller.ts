import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../guards/admin.guard';
import { AdminUsersService } from '../services/admin-users.service';
import { UpdateUserRoleDto } from '../dto/update-user-role.dto';
import { SearchUsersDto } from '../dto/search-users.dto';

@ApiTags('admin/users')
@Controller('admin/users')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth()
export class AdminUsersController {
  constructor(private readonly adminUsersService: AdminUsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users (admin)' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getAllUsers(@Query() searchParams: SearchUsersDto) {
    return this.adminUsersService.getAllUsers(searchParams);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get user by ID (admin)' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserById(@Param('userId') userId: string) {
    return this.adminUsersService.getUserById(userId);
  }

  @Patch(':userId/role')
  @ApiOperation({ summary: 'Update user role (admin)' })
  @ApiResponse({ status: 200, description: 'User role updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updateUserRole(
    @Param('userId') userId: string,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
  ) {
    return this.adminUsersService.updateUserRole(userId, updateUserRoleDto);
  }

  @Delete(':userId')
  @ApiOperation({ summary: 'Delete user (admin)' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async deleteUser(@Param('userId') userId: string) {
    return this.adminUsersService.deleteUser(userId);
  }
}
