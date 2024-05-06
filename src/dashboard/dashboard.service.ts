import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CustomError } from 'src/common/helpers/exceptions';
import { Student } from 'src/schemas/student.schema';
import { DashboardDTO } from './DTO/dashboard.dto';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Student.name)
    private readonly studentModule: Model<Student>,
  ) {}

  async totalStudentCount(dashboardDTO: DashboardDTO) {
    try {
      const queryForFindStd = dashboardDTO.std ? { std: dashboardDTO.std } : {};
      const queryForFindSchool = dashboardDTO.schoolId
        ? { schoolId: new mongoose.Types.ObjectId(dashboardDTO.schoolId) }
        : {};

      const totalStudentCount = await this.studentModule
        .find({ ...queryForFindStd, ...queryForFindSchool, isDelete: false })
        .countDocuments();

      return { totalStudentCount };
    } catch (error) {
      throw CustomError.customException(
        error.message,
        error.statusCode ?? HttpStatus.BAD_REQUEST,
      );
    }
  }
}
