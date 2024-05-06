import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class StudentDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  schoolId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  parentNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  std: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  photo: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  dob: string;
}

export class SchoolStudentListDTO {
  @ApiProperty()
  @IsOptional()
  schoolId: string;

  @ApiProperty()
  @IsOptional()
  limit: number;

  @ApiProperty()
  @IsOptional()
  offset: number;

  @ApiProperty()
  @IsOptional()
  search: string;

  @ApiProperty()
  @IsOptional()
  sortOrder: string;

  @ApiProperty()
  @IsOptional()
  sortBy: string;
}
