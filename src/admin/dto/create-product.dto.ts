import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
  IsBoolean,
  Min,
  Max,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ required: false, default: 0 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  discount?: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  images: string[];

  @ApiProperty({ required: false, default: false })
  @IsBoolean()
  @IsOptional()
  featured?: boolean;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  categoryId: string;
}
