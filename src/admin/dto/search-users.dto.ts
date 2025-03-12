import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { Role } from '@prisma/client';

export class SearchUsersDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ enum: Role, required: false })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  sort?: string;
}
