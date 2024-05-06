import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { StudentService } from './school.service';
import { ResponseMassage } from 'src/common/decorator/response.decorater';
import {
  StudentDTO,
  StudentListDTO,
  StudentStatusDTO,
} from './DTO/student.dto';
import { SchoolGuard } from 'src/common/guard/school.guard';
import { StudentDetailService } from 'src/common/services/student.service';
import * as SUCCESS_MASSAGE from 'src/utils/constans/sucessMassage';

@ApiTags('School')
@Controller('school/student')
@ApiBearerAuth()
@UseGuards(SchoolGuard)
export class StudentController {
  constructor(
    private studentService: StudentService,
    private studentDetailService: StudentDetailService,
  ) {}

  @Post('')
  @ResponseMassage(SUCCESS_MASSAGE.CREATE_STUDENT)
  createStudent(@Body() studentDTO: StudentDTO, @Req() req: any) {
    return this.studentService.createStudent(studentDTO, req);
  }

  @Put('/:id')
  @ApiParam({ name: 'id' })
  @ResponseMassage(SUCCESS_MASSAGE.EDIT_STUDENT)
  editStudent(@Param('id') id: string, @Body() studentData: StudentDTO) {
    return this.studentService.editStudent(id, studentData);
  }

  @Get('/:id')
  @ApiParam({ name: 'id' })
  @ResponseMassage(SUCCESS_MASSAGE.GET_DETAIL_STUDENT)
  studentDetail(@Param('id') id: string) {
    return this.studentDetailService.studentDetail(id);
  }

  @Post('/list')
  @HttpCode(HttpStatus.OK)
  @ResponseMassage(SUCCESS_MASSAGE.GET_LIST_STUDENT)
  studentList(@Body() schoolListDTO: StudentListDTO) {
    return this.studentService.studentList(schoolListDTO);
  }

  @Delete('/:id')
  @ApiParam({ name: 'id' })
  @ResponseMassage(SUCCESS_MASSAGE.DELETE_STUDENT)
  deleteStudent(@Param('id') id: string) {
    return this.studentService.deleteStudent(id);
  }

  @Post('/active-inactive')
  @ResponseMassage(SUCCESS_MASSAGE.SATUS_STUDENT)
  studentStatus(@Body() statusData: StudentStatusDTO) {
    return this.studentService.statusStudent(statusData);
  }
}
