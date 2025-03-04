import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SearchProductsDto } from './dto/search-products.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async searchProducts(searchParams: SearchProductsDto) {
    const {
      page = 1,
      limit = 10,
      search = '',
      category,
      sort = 'createdAt_desc',
      minPrice,
      maxPrice,
    } = searchParams;

    const skip = (page - 1) * limit;
    const [sortField, sortOrder] = sort.split('_');

    const where: any = {
      name: {
        contains: search,
        mode: 'insensitive',
      },
    };

    if (category) {
      where.categoryId = category;
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

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          ...(sortField !== 'popular'
            ? { [sortField]: sortOrder === 'asc' ? 'asc' : 'desc' }
            : {}),
          ...(sortField === 'popular'
            ? { orderItems: { _count: sortOrder as 'asc' | 'desc' } }
            : {}),
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
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async getFeaturedProducts() {
    return this.prisma.product.findMany({
      where: { featured: true },
      take: 8,
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

  async getRelatedProducts(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { categoryId: true },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: productId },
      },
      take: 4,
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
}
