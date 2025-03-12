import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminDashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardStats() {
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      lowStockProducts,
      recentOrders,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.product.count(),
      this.prisma.order.count(),
      this.prisma.order.aggregate({
        _sum: {
          totalAmount: true,
        },
        where: {
          paymentStatus: 'PAID',
        },
      }),
      this.prisma.product.count({
        where: {
          stock: {
            lt: 10,
          },
        },
      }),
      this.prisma.order.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
    ]);

    return {
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      lowStockProducts,
      recentOrders,
    };
  }

  async getSalesStats(period: string) {
    let dateFilter: any = {};
    const now = new Date();

    switch (period) {
      case 'week':
        const lastWeek = new Date(now);
        lastWeek.setDate(lastWeek.getDate() - 7);
        dateFilter = {
          createdAt: {
            gte: lastWeek,
          },
        };
        break;
      case 'month':
        const lastMonth = new Date(now);
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        dateFilter = {
          createdAt: {
            gte: lastMonth,
          },
        };
        break;
      case 'year':
        const lastYear = new Date(now);
        lastYear.setFullYear(lastYear.getFullYear() - 1);
        dateFilter = {
          createdAt: {
            gte: lastYear,
          },
        };
        break;
      default:
        const last30Days = new Date(now);
        last30Days.setDate(last30Days.getDate() - 30);
        dateFilter = {
          createdAt: {
            gte: last30Days,
          },
        };
    }

    const orders = await this.prisma.order.findMany({
      where: dateFilter,
      select: {
        id: true,
        totalAmount: true,
        createdAt: true,
        status: true,
        paymentStatus: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Group by date for chart data
    const salesByDate = orders.reduce((acc, order) => {
      const date = order.createdAt.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = {
          date,
          orders: 0,
          revenue: 0,
        };
      }
      acc[date].orders += 1;
      acc[date].revenue += order.totalAmount;
      return acc;
    }, {});

    return {
      salesByDate: Object.values(salesByDate),
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, order) => sum + order.totalAmount, 0),
      averageOrderValue:
        orders.length > 0
          ? orders.reduce((sum, order) => sum + order.totalAmount, 0) /
            orders.length
          : 0,
    };
  }

  async getTopProducts() {
    const topProducts = await this.prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: {
        quantity: true,
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: 5,
    });

    const productDetails = await Promise.all(
      topProducts.map(async (item) => {
        const product = await this.prisma.product.findUnique({
          where: { id: item.productId },
          select: {
            id: true,
            name: true,
            price: true,
            images: true,
            stock: true,
          },
        });
        return {
          ...product,
          totalSold: item._sum.quantity,
        };
      }),
    );

    return productDetails;
  }

  async getRecentOrders() {
    return this.prisma.order.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc',
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
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true,
              },
            },
          },
        },
      },
    });
  }
}
