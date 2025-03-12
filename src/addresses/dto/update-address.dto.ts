import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsOptional, IsBoolean } from "class-validator"

export class UpdateAddressDto {
  @ApiProperty({ example: "Home", required: false })
  @IsString()
  @IsOptional()
  title?: string

  @ApiProperty({ example: "New York", required: false })
  @IsString()
  @IsOptional()
  city?: string

  @ApiProperty({ example: "Broadway", required: false })
  @IsString()
  @IsOptional()
  street?: string

  @ApiProperty({ example: "123", required: false })
  @IsString()
  @IsOptional()
  house?: string

  @ApiProperty({ example: "45", required: false })
  @IsString()
  @IsOptional()
  apartment?: string

  @ApiProperty({ example: "10001", required: false })
  @IsString()
  @IsOptional()
  zipCode?: string

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isDefault?: boolean
}

