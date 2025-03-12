import { Controller, Post, Body, UseGuards, Get, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CheckoutService } from './checkout.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { GetUser } from '../users/decorators/get-user.decorator';
import { User } from '@prisma/client';

@ApiTags('checkout')
@Controller('checkout')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createOrder(
    @GetUser() user: User,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return this.checkoutService.createOrder(user.id, createOrderDto);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get checkout summary from cart' })
  @ApiResponse({
    status: 200,
    description: 'Checkout summary retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getCheckoutSummary(@GetUser() user: User) {
    return this.checkoutService.getCheckoutSummary(user.id);
  }

  @Get('payment-methods')
  @ApiOperation({ summary: 'Get available payment methods' })
  @ApiResponse({
    status: 200,
    description: 'Payment methods retrieved successfully',
  })
  async getPaymentMethods() {
    return this.checkoutService.getPaymentMethods();
  }

  @Get('order/:orderId')
  @ApiOperation({ summary: 'Get order details after checkout' })
  @ApiResponse({
    status: 200,
    description: 'Order details retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async getOrderDetails(
    @GetUser() user: User,
    @Param('orderId') orderId: string,
  ) {
    return this.checkoutService.getOrderDetails(user.id, orderId);
  }
}
