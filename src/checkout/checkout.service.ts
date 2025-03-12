import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CheckoutService {
  constructor(private readonly prisma: PrismaService) {}

  private makeString(length: number = 32): string {
    let outString: string = '';
    const inOptions: string = '0123456789';

    for (let i = 0; i < length; i++) {
      outString += inOptions.charAt(
        Math.floor(Math.random() * inOptions.length),
      );
    }

    return outString;
  }

  async createOrder(userId: string, createOrderDto: CreateOrderDto) {
    const { addressId, paymentMethod, deliveryMethod } = createOrderDto;

    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    const address = await this.prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!address || address.userId !== userId) {
      throw new NotFoundException('Address not found');
    }

    let totalAmount = 0;
    const orderItems: Prisma.OrderItemCreateManyOrderInput[] = [];
    const stockUpdates: Promise<any>[] = [];

    for (const item of cart.items) {
      if (item.quantity > item.product.stock) {
        throw new ConflictException(
          `Not enough stock for product: ${item.product.name}`,
        );
      }

      const price = item.product.price;
      const discount = item.product.discount || 0;
      const finalPrice = price - (price * discount) / 100;

      totalAmount += finalPrice * item.quantity;

      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.price,
        discount: item.product.discount || 0,
      });

      // Update product stock
      stockUpdates.push(
        this.prisma.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        }),
      );
    }

    // Format address as string
    const addressString = `${address.street}, ${address.house}${address.apartment ? `, кв.${address.apartment}` : ''}, ${address.city}, ${address.zipCode}`;

    // Create the order
    const order = await this.prisma.order.create({
      data: {
        deliveryCost:
          deliveryMethod === 'express'
            ? 1000
            : deliveryMethod === 'standard'
              ? 500
              : deliveryMethod === 'cargo'
                ? 1500
                : 0,
        deliveryMethod: deliveryMethod,
        userId,
        totalAmount,
        trackingNumber: this.makeString(16),
        address: addressString,
        phone: address.title,
        paymentMethod,
        items: {
          createMany: {
            data: orderItems,
          },
        },
      },
      include: {
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

    // Update product stock
    await Promise.all(stockUpdates);

    // Clear the cart
    await this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return order;
  }

  async getCheckoutSummary(userId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    let subtotal = 0;
    let discount = 0;
    const items = cart.items.map((item) => {
      const itemPrice = item.product.price;
      const itemDiscount = item.product.discount || 0;
      const finalPrice = itemPrice - (itemPrice * itemDiscount) / 100;

      subtotal += itemPrice * item.quantity;
      discount += ((itemPrice * itemDiscount) / 100) * item.quantity;

      return {
        id: item.id,
        product: {
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          discount: item.product.discount,
          images: item.product.images,
        },
        quantity: item.quantity,
        price: itemPrice,
        finalPrice,
        totalPrice: finalPrice * item.quantity,
      };
    });

    const total = subtotal - discount;

    // Get user addresses
    const addresses = await this.prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });

    return {
      items,
      summary: {
        subtotal,
        discount,
        total,
      },
      addresses,
    };
  }

  async getPaymentMethods() {
    // This would typically come from a payment gateway integration
    return [
      {
        id: 'credit_card',
        name: 'Credit Card',
        description: 'Pay with Visa, Mastercard, or American Express',
      },
      {
        id: 'paypal',
        name: 'PayPal',
        description: 'Pay with your PayPal account',
      },
      {
        id: 'cash',
        name: 'Cash on Delivery',
        description: 'Pay when you receive your order',
      },
    ];
  }

  async getOrderDetails(userId: string, orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
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

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.userId !== userId) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }
}
