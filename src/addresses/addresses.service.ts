import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressesService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserAddresses(userId: string) {
    return this.prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async getAddressById(userId: string, addressId: string) {
    const address = await this.prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    if (address.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to access this address',
      );
    }

    return address;
  }

  async createAddress(userId: string, createAddressDto: CreateAddressDto) {
    const { isDefault = false, ...addressData } = createAddressDto;

    // If this is the first address or set as default, unset any existing default
    if (isDefault) {
      await this.prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    // If this is the first address, make it default regardless of input
    const addressCount = await this.prisma.address.count({
      where: { userId },
    });

    const shouldBeDefault = addressCount === 0 ? true : isDefault;

    return this.prisma.address.create({
      data: {
        ...addressData,
        isDefault: shouldBeDefault,
        userId,
      },
    });
  }

  async updateAddress(
    userId: string,
    addressId: string,
    updateAddressDto: UpdateAddressDto,
  ) {
    // Check if address exists and belongs to user
    const address = await this.prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    if (address.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to update this address',
      );
    }

    const { isDefault, ...addressData } = updateAddressDto;

    // If setting as default, unset any existing default
    if (isDefault) {
      await this.prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    return this.prisma.address.update({
      where: { id: addressId },
      data: {
        ...addressData,
        isDefault: isDefault !== undefined ? isDefault : address.isDefault,
      },
    });
  }

  async deleteAddress(userId: string, addressId: string) {
    // Check if address exists and belongs to user
    const address = await this.prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    if (address.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to delete this address',
      );
    }

    await this.prisma.address.delete({
      where: { id: addressId },
    });

    // If the deleted address was default, set another address as default if available
    if (address.isDefault) {
      const anotherAddress = await this.prisma.address.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });

      if (anotherAddress) {
        await this.prisma.address.update({
          where: { id: anotherAddress.id },
          data: { isDefault: true },
        });
      }
    }

    return { message: 'Address deleted successfully' };
  }

  async setDefaultAddress(userId: string, addressId: string) {
    // Check if address exists and belongs to user
    const address = await this.prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    if (address.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to update this address',
      );
    }

    // Unset any existing default
    await this.prisma.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });

    // Set the new default
    await this.prisma.address.update({
      where: { id: addressId },
      data: { isDefault: true },
    });

    return { message: 'Address set as default successfully' };
  }
}
