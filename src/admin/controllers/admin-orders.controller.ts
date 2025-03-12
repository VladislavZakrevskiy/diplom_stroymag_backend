import {
  Controller,
  Get,
  Patch,
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
import { AdminOrdersService } from '../services/admin-orders.service';
import { UpdateOrderStatusDto } from '../dto/update-order-status.dto';
import { SearchOrdersDto } from '../dto/search-orders.dto';

@ApiTags('admin/orders')
@Controller('admin/orders')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth()
export class AdminOrdersController {
  constructor(private readonly adminOrdersService: AdminOrdersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all orders (admin)' })
  @ApiResponse({ status: 200, description: 'Orders retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getAllOrders(@Query() searchParams: SearchOrdersDto) {
    return this.adminOrdersService.getAllOrders(searchParams);
  }

  @Get(':orderId')
  @ApiOperation({ summary: 'Get order by ID (admin)' })
  @ApiResponse({ status: 200, description: 'Order retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async getOrderById(@Param('orderId') orderId: string) {
    return this.adminOrdersService.getOrderById(orderId);
  }

  @Patch(':orderId/status')
  @ApiOperation({ summary: 'Update order status (admin)' })
  @ApiResponse({
    status: 200,
    description: 'Order status updated successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async updateOrderStatus(
    @Param('orderId') orderId: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    return this.adminOrdersService.updateOrderStatus(
      orderId,
      updateOrderStatusDto,
    );
  }

  @Patch(':orderId/tracking')
  @ApiOperation({ summary: 'Update order tracking number (admin)' })
  @ApiResponse({
    status: 200,
    description: 'Order tracking number updated successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async updateOrderTracking(
    @Param('orderId') orderId: string,
    @Body() updateOrderTrackingDto: { trackingNumber: string },
  ) {
    return this.adminOrdersService.updateOrderTracking(
      orderId,
      updateOrderTrackingDto.trackingNumber,
    );
  }
}
