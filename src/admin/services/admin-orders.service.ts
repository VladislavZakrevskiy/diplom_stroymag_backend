import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateOrderStatusDto } from '../dto/update-order-status.dto';
import { SearchOrdersDto } from '../dto/search-orders.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AdminOrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllOrders(searchParams: SearchOrdersDto) {
    const {
      page = 1,
      limit = 10,
      search = '',
      status,
      paymentStatus,
      sort = 'createdAt_desc',
      startDate,
      endDate,
    } = searchParams;

    const skip = (page - 1) * limit;
    const [sortField, sortOrder] = sort.split('_');

    const where: Prisma.OrderWhereInput = {};

    if (search) {
      where.OR = [
        { id: { contains: search } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
        { user: { firstName: { contains: search, mode: 'insensitive' } } },
        { user: { lastName: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (paymentStatus) {
      where.paymentStatus = paymentStatus;
    }

    if (startDate || endDate) {
      where.createdAt = {};

      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }

      if (endDate) {
        where.createdAt.lte = new Date(endDate);
      }
    }

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortField]: sortOrder === 'asc' ? 'asc' : 'desc',
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
          _count: {
            select: {
              items: true,
            },
          },
        },
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      data: orders,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getOrderById(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async updateOrderStatus(
    orderId: string,
    updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: updateOrderStatusDto.status,
        ...(updateOrderStatusDto.paymentStatus && {
          paymentStatus: updateOrderStatusDto.paymentStatus,
        }),
        ...(updateOrderStatusDto.notes && {
          notes: updateOrderStatusDto.notes,
        }),
      },
    });
  }

  async updateOrderTracking(orderId: string, trackingNumber: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return this.prisma.order.update({
      where: { id: orderId },
      data: {
        trackingNumber,
      },
    });
  }
}
