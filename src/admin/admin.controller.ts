import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { SchoolDTO, SchoolListDTO } from './DTO/school.dto';
import { AdminService } from './admin.service';
import { ResponseMassage } from 'src/common/decorator/response.decorater';
import { SchoolStudentListDTO } from './DTO/student.dto';
import { AdminGuard } from 'src/common/guard/admin.guard';
import { StudentDetailService } from 'src/common/services/student.service';
import * as SUCCESS_MASSAGE from '../utils/constans/sucessMassage';

@ApiTags('Admin ')
@Controller('admin/school')
@ApiBearerAuth()
export class AdminController {
  constructor(
    private adminService: AdminService,
    private studentDetailService: StudentDetailService,
  ) {}

  @Post('')
  @UseGuards(AdminGuard)
  @ResponseMassage(SUCCESS_MASSAGE.CREATE_SCHOOL)
  craeteSchool(@Body() schoolDTO: SchoolDTO) {
    return this.adminService.createSchool(schoolDTO);
  }

  @Put('/:id')
  @ApiParam({ name: 'id' })
  @ResponseMassage(SUCCESS_MASSAGE.EDIT_SCHOOL)
  editSchool(@Param('id') id: string, @Body() schoolDTO: SchoolDTO) {
    return this.adminService.editSchool(id, schoolDTO);
  }

  @Get('/:id')
  @ApiParam({ name: 'id' })
  @ResponseMassage(SUCCESS_MASSAGE.GET_DETAIL_SCHOOL)
  schoolDetail(@Param('id') id: string) {
    return this.adminService.schoolDetail(id);
  }

  @Get('/student/:id')
  @ApiParam({ name: 'id' })
  @ResponseMassage(SUCCESS_MASSAGE.GET_DETAIL_STUDENT)
  studentDetail(@Param('id') id: string) {
    return this.studentDetailService.studentDetail(id);
  }

  @Post('/list')
  @HttpCode(HttpStatus.OK)
  @ResponseMassage(SUCCESS_MASSAGE.GET_LIST_SCHOOL)
  schoolList(@Body() schoolListDTO: SchoolListDTO) {
    return this.adminService.schoolList(schoolListDTO);
  }

  @Post('/student-list')
  @HttpCode(HttpStatus.OK)
  @ResponseMassage(SUCCESS_MASSAGE.GET_LIST_SCHOOL)
  studentList(@Body() studentListDTO: SchoolStudentListDTO) {
    return this.adminService.studentOfSchool(studentListDTO);
  }
}
