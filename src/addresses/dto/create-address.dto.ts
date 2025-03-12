import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString, IsOptional, IsBoolean } from "class-validator"

export class CreateAddressDto {
  @ApiProperty({ example: "Home" })
  @IsString()
  @IsNotEmpty()
  title: string

  @ApiProperty({ example: "New York" })
  @IsString()
  @IsNotEmpty()
  city: string

  @ApiProperty({ example: "Broadway" })
  @IsString()
  @IsNotEmpty()
  street: string

  @ApiProperty({ example: "123" })
  @IsString()
  @IsNotEmpty()
  house: string

  @ApiProperty({ example: "45", required: false })
  @IsString()
  @IsOptional()
  apartment?: string

  @ApiProperty({ example: "10001" })
  @IsString()
  @IsNotEmpty()
  zipCode: string

  @ApiProperty({ example: false, required: false })
  @IsBoolean()
  @IsOptional()
  isDefault?: boolean
}

