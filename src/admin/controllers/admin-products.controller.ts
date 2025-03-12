import {
  Controller,
  Get,
  Post,
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
import { AdminProductsService } from '../services/admin-products.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { SearchProductsDto } from '../dto/search-products.dto';

@ApiTags('admin/products')
@Controller('admin/products')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth()
export class AdminProductsController {
  constructor(private readonly adminProductsService: AdminProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all products (admin)' })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getAllProducts(@Query() searchParams: SearchProductsDto) {
    return this.adminProductsService.getAllProducts(searchParams);
  }

  @Get(':productId')
  @ApiOperation({ summary: 'Get product by ID (admin)' })
  @ApiResponse({ status: 200, description: 'Product retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async getProductById(@Param('productId') productId: string) {
    return this.adminProductsService.getProductById(productId);
  }

  @Post()
  @ApiOperation({ summary: 'Create new product (admin)' })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createProduct(@Body() createProductDto: CreateProductDto) {
    return this.adminProductsService.createProduct(createProductDto);
  }

  @Patch(':productId')
  @ApiOperation({ summary: 'Update product (admin)' })
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async updateProduct(
    @Param('productId') productId: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.adminProductsService.updateProduct(productId, updateProductDto);
  }

  @Delete(':productId')
  @ApiOperation({ summary: 'Delete product (admin)' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async deleteProduct(@Param('productId') productId: string) {
    return this.adminProductsService.deleteProduct(productId);
  }

  @Post(':productId/featured')
  @ApiOperation({ summary: 'Toggle product featured status (admin)' })
  @ApiResponse({
    status: 200,
    description: 'Product featured status updated successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async toggleFeatured(@Param('productId') productId: string) {
    return this.adminProductsService.toggleFeatured(productId);
  }
}
