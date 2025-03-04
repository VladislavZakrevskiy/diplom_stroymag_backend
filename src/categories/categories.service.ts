import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllCategories() {
    return await this.prisma.category.findMany({
      include: {
        _count: true,
        children: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      where: {
        parentId: null,
      },
    });
  }

  async getCategoryById(categoryId: string) {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        children: true,
        products: {
          select: {
            id: true,
            name: true,
            price: true,
            images: true,
            stock: true,
            featured: true,
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }
}
