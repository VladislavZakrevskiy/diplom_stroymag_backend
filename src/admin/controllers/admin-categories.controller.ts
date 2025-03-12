import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
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
import { AdminCategoriesService } from '../services/admin-categories.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';

@ApiTags('admin/categories')
@Controller('admin/categories')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth()
export class AdminCategoriesController {
  constructor(
    private readonly adminCategoriesService: AdminCategoriesService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all categories (admin)' })
  @ApiResponse({
    status: 200,
    description: 'Categories retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getAllCategories() {
    return this.adminCategoriesService.getAllCategories();
  }

  @Get(':categoryId')
  @ApiOperation({ summary: 'Get category by ID (admin)' })
  @ApiResponse({ status: 200, description: 'Category retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async getCategoryById(@Param('categoryId') categoryId: string) {
    return this.adminCategoriesService.getCategoryById(categoryId);
  }

  @Post()
  @ApiOperation({ summary: 'Create new category (admin)' })
  @ApiResponse({ status: 201, description: 'Category created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.adminCategoriesService.createCategory(createCategoryDto);
  }

  @Patch(':categoryId')
  @ApiOperation({ summary: 'Update category (admin)' })
  @ApiResponse({ status: 200, description: 'Category updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async updateCategory(
    @Param('categoryId') categoryId: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.adminCategoriesService.updateCategory(
      categoryId,
      updateCategoryDto,
    );
  }

  @Delete(':categoryId')
  @ApiOperation({ summary: 'Delete category (admin)' })
  @ApiResponse({ status: 200, description: 'Category deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async deleteCategory(@Param('categoryId') categoryId: string) {
    return this.adminCategoriesService.deleteCategory(categoryId);
  }
}
