import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';

@Injectable()
export class AdminCategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllCategories() {
    return this.prisma.category.findMany({
      include: {
        parent: {
          select: {
            id: true,
            name: true,
          },
        },
        children: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            products: true,
          },
        },
      },
    });
  }

  async getCategoryById(categoryId: string) {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        parent: true,
        children: true,
        products: {
          take: 10,
          select: {
            id: true,
            name: true,
            price: true,
            images: true,
          },
        },
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async createCategory(createCategoryDto: CreateCategoryDto) {
    const { name, parentId, ...categoryData } = createCategoryDto;

    // Check if category with same name already exists
    const existingCategory = await this.prisma.category.findUnique({
      where: { name },
    });

    if (existingCategory) {
      throw new ConflictException('Category with this name already exists');
    }

    // Check if parent category exists if provided
    if (parentId) {
      const parentCategory = await this.prisma.category.findUnique({
        where: { id: parentId },
      });

      if (!parentCategory) {
        throw new NotFoundException('Parent category not found');
      }
    }

    return this.prisma.category.create({
      data: {
        name,
        ...categoryData,
        ...(parentId && { parentId }),
      },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async updateCategory(
    categoryId: string,
    updateCategoryDto: UpdateCategoryDto,
  ) {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const { name, parentId, ...categoryData } = updateCategoryDto;

    // Check if category with same name already exists
    if (name && name !== category.name) {
      const existingCategory = await this.prisma.category.findUnique({
        where: { name },
      });

      if (existingCategory) {
        throw new ConflictException('Category with this name already exists');
      }
    }

    // Check if parent category exists if provided
    if (parentId) {
      // Prevent setting self as parent
      if (parentId === categoryId) {
        throw new ConflictException('Category cannot be its own parent');
      }

      const parentCategory = await this.prisma.category.findUnique({
        where: { id: parentId },
      });

      if (!parentCategory) {
        throw new NotFoundException('Parent category not found');
      }

      // Prevent circular references
      let currentParent = parentCategory;
      while (currentParent.parentId) {
        if (currentParent.parentId === categoryId) {
          throw new ConflictException(
            'Circular reference detected in category hierarchy',
          );
        }
        currentParent = await this.prisma.category.findUnique({
          where: { id: currentParent.parentId },
        });
      }
    }

    return this.prisma.category.update({
      where: { id: categoryId },
      data: {
        ...(name && { name }),
        ...categoryData,
        ...(parentId !== undefined && { parentId }),
      },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async deleteCategory(categoryId: string) {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        children: true,
        products: true,
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Check if category has children or products
    if (category.children.length > 0) {
      throw new ConflictException('Cannot delete category with subcategories');
    }

    if (category.products.length > 0) {
      throw new ConflictException('Cannot delete category with products');
    }

    await this.prisma.category.delete({
      where: { id: categoryId },
    });

    return { message: 'Category deleted successfully' };
  }
}
