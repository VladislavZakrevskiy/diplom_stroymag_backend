import { Controller, Post, Query } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import axios from 'axios';
import { v4 } from 'uuid';
import { PrismaService } from './prisma.service';

@Controller('prisma')
export class PrismaController {
  constructor(private prisma: PrismaService) {}

  async getRandomImageUrl() {
    try {
      const response = await axios.get('https://picsum.photos/600/600', {
        maxRedirects: 0,
        validateStatus: (status) => status === 302,
      });
      return response.headers.location;
    } catch (error) {
      console.error('Ошибка при получении изображения:', error.message);
      return null;
    }
  }

  private async generateProduct(categories: string[]) {
    const imageUrls = [];
    for (let j = 0; j < Math.floor(Math.random() * 3) + 1; j++) {
      const imageUrl = await this.getRandomImageUrl();
      if (imageUrl) {
        imageUrls.push(imageUrl);
      }
    }

    const item: Prisma.ProductCreateManyInput = {
      categoryId: categories[Math.floor(Math.random() * categories.length)],
      id: v4(),
      name: `Товар ${(Math.random() * 1000 + 100).toFixed(0)}`,
      description: `Описание товара ${(Math.random() * 1000 + 100).toFixed(0)}`,
      price: parseFloat((Math.random() * 1000 + 100).toFixed(0)),
      discount: parseFloat((Math.random() * 20).toFixed(0)),
      stock: Math.floor(Math.random() * 100),
      images: imageUrls,
      featured: Math.random() > 0.5,
    };

    return item;
  }

  @Post()
  async generateProducts(@Query('num') num: string) {
    const data: Promise<Prisma.ProductCreateManyInput>[] = [];
    let categories = await this.prisma.category.findMany({
      select: { id: true },
    });
    if (categories.length === 0) {
      categories = await this.prisma.category.createManyAndReturn({
        select: { id: true },
        data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => ({
          name: `Категория ${num}`,
        })),
      });
    }

    for (let i = 0; i < Number(num); i++) {
      data.push(this.generateProduct(categories.map(({ id }) => id)));
    }

    return await this.prisma.product.createMany({
      data: await Promise.all(data),
    });
  }
}
