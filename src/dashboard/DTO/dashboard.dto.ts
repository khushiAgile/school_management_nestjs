import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class DashboardDTO {
  @ApiProperty()
  @IsOptional()
  @IsString()
  std: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  schoolId: string;
}
