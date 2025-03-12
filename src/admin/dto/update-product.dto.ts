import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
  IsBoolean,
  Min,
  Max,
} from 'class-validator';

export class UpdateProductDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  discount?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  stock?: number;

  @ApiProperty({ type: [String], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  featured?: boolean;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  categoryId?: string;
}
