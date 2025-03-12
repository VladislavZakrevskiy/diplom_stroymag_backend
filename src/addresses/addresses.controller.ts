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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { GetUser } from '../users/decorators/get-user.decorator';
import { User } from '@prisma/client';

@ApiTags('addresses')
@Controller('addresses')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Get()
  @ApiOperation({ summary: 'Get user addresses' })
  @ApiResponse({ status: 200, description: 'Addresses retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getUserAddresses(@GetUser() user: User) {
    return this.addressesService.getUserAddresses(user.id);
  }

  @Get(':addressId')
  @ApiOperation({ summary: 'Get address by ID' })
  @ApiResponse({ status: 200, description: 'Address retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Address not found' })
  async getAddressById(
    @GetUser() user: User,
    @Param('addressId') addressId: string,
  ) {
    return this.addressesService.getAddressById(user.id, addressId);
  }

  @Post()
  @ApiOperation({ summary: 'Create new address' })
  @ApiResponse({ status: 201, description: 'Address created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createAddress(
    @GetUser() user: User,
    @Body() createAddressDto: CreateAddressDto,
  ) {
    return this.addressesService.createAddress(user.id, createAddressDto);
  }

  @Patch(':addressId')
  @ApiOperation({ summary: 'Update address' })
  @ApiResponse({ status: 200, description: 'Address updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Address not found' })
  async updateAddress(
    @GetUser() user: User,
    @Param('addressId') addressId: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
    return this.addressesService.updateAddress(
      user.id,
      addressId,
      updateAddressDto,
    );
  }

  @Delete(':addressId')
  @ApiOperation({ summary: 'Delete address' })
  @ApiResponse({ status: 200, description: 'Address deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Address not found' })
  async deleteAddress(
    @GetUser() user: User,
    @Param('addressId') addressId: string,
  ) {
    return this.addressesService.deleteAddress(user.id, addressId);
  }

  @Post(':addressId/default')
  @ApiOperation({ summary: 'Set address as default' })
  @ApiResponse({
    status: 200,
    description: 'Address set as default successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Address not found' })
  async setDefaultAddress(
    @GetUser() user: User,
    @Param('addressId') addressId: string,
  ) {
    return this.addressesService.setDefaultAddress(user.id, addressId);
  }
}
