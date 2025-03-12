import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../guards/admin.guard';
import { AdminDashboardService } from '../services/admin-dashboard.service';

@ApiTags('admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth()
export class AdminDashboardController {
  constructor(private readonly adminDashboardService: AdminDashboardService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get dashboard statistics (admin)' })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getDashboardStats() {
    return this.adminDashboardService.getDashboardStats();
  }

  @Get('sales')
  @ApiOperation({ summary: 'Get sales statistics (admin)' })
  @ApiResponse({
    status: 200,
    description: 'Sales statistics retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getSalesStats(@Query('period') period: string = 'month') {
    return this.adminDashboardService.getSalesStats(period);
  }

  @Get('top-products')
  @ApiOperation({ summary: 'Get top selling products (admin)' })
  @ApiResponse({
    status: 200,
    description: 'Top products retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getTopProducts() {
    return this.adminDashboardService.getTopProducts();
  }

  @Get('recent-orders')
  @ApiOperation({ summary: 'Get recent orders (admin)' })
  @ApiResponse({
    status: 200,
    description: 'Recent orders retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getRecentOrders() {
    return this.adminDashboardService.getRecentOrders();
  }
}
