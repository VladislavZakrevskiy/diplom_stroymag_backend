import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { SearchProductsDto } from '../dto/search-products.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AdminProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllProducts(searchParams: SearchProductsDto) {
    const {
      page = 1,
      limit = 10,
      search = '',
      category,
      sort = 'createdAt_desc',
      minPrice,
      maxPrice,
      isSale,
      inStock,
    } = searchParams;

    const skip = (page - 1) * limit;
    const [sortField, sortOrder] = sort.split('_');

    const where: Prisma.ProductWhereInput = {
      name: {
        contains: search,
        mode: 'insensitive',
      },
    };

    if (category) {
      where.categoryId = category;
    }

    if (inStock === 'true') {
      where.stock = { gt: 0 };
    }

    if (inStock === 'false') {
      where.stock = { equals: 0 };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};

      if (minPrice !== undefined) {
        where.price.gte = minPrice;
      }

      if (maxPrice !== undefined) {
        where.price.lte = maxPrice;
      }
    }

    if (isSale) {
      where.discount = { not: { equals: 0 } };
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortField]: sortOrder === 'asc' ? 'asc' : 'desc',
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getProductById(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async createProduct(createProductDto: CreateProductDto) {
    const { categoryId, ...productData } = createProductDto;

    // Check if category exists
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return this.prisma.product.create({
      data: {
        ...productData,
        categoryId,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async updateProduct(productId: string, updateProductDto: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const { categoryId, ...productData } = updateProductDto;

    // Check if category exists if provided
    if (categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: categoryId },
      });

      if (!category) {
        throw new NotFoundException('Category not found');
      }
    }

    return this.prisma.product.update({
      where: { id: productId },
      data: {
        ...productData,
        ...(categoryId && { categoryId }),
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async deleteProduct(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.prisma.product.delete({
      where: { id: productId },
    });

    return { message: 'Product deleted successfully' };
  }

  async toggleFeatured(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.prisma.product.update({
      where: { id: productId },
      data: {
        featured: !product.featured,
      },
    });
  }
}
