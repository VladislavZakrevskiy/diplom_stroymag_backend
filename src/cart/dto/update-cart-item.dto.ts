import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, Min } from 'class-validator';

export class UpdateCartItemDto {
  @ApiProperty({ minimum: 1 })
  @IsNumber()
  @IsPositive()
  @Min(1)
  quantity: number;
}
