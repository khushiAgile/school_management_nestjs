import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class StudentDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsPhoneNumber()
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

export class StudentListDTO {
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

  @ApiProperty()
  @IsOptional()
  schoolId: string;

  @ApiProperty()
  @IsOptional()
  std: string[];
}

export class StudentStatusDTO {
  @ApiProperty()
  @IsNotEmpty()
  status: boolean;

  @ApiProperty()
  @IsString()
  studentId: string;
}
