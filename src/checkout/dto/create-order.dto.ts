import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  addressId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  paymentMethod: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  deliveryMethod: string;
}
