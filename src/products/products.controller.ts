import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { SearchProductsDto } from './dto/search-products.dto';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Search products' })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
  async searchProducts(@Query() searchParams: SearchProductsDto) {
    return this.productsService.searchProducts(searchParams);
  }

  @Get('featured')
  @ApiOperation({ summary: 'Get featured products' })
  @ApiResponse({
    status: 200,
    description: 'Featured products retrieved successfully',
  })
  async getFeaturedProducts() {
    return this.productsService.getFeaturedProducts();
  }

  @Get(':productId')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiResponse({ status: 200, description: 'Product retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async getProductById(@Param('productId') productId: string) {
    return this.productsService.getProductById(productId);
  }

  @Get(':productId/related')
  @ApiOperation({ summary: 'Get related products' })
  @ApiResponse({
    status: 200,
    description: 'Related products retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async getRelatedProducts(@Param('productId') productId: string) {
    return this.productsService.getRelatedProducts(productId);
  }
}
