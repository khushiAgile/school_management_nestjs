import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student, StudentDocument } from 'src/schemas/student.schema';
import { CustomError } from '../helpers/exceptions';

@Injectable()
export class StudentDetailService {
  constructor(
    @InjectModel(Student.name)
    private readonly studentModule: Model<StudentDocument>,
  ) {}

  async studentDetail(id: string) {
    try {
      const findStudent = await this.studentModule.findOne({ _id: id });

      if (!findStudent) {
        throw CustomError.customException(
          'Student not exist',
          HttpStatus.BAD_REQUEST,
        );
      }
      return findStudent;
    } catch (error) {
      throw CustomError.customException(
        error.message,
        error.statusCode ?? HttpStatus.BAD_REQUEST,
      );
    }
  }
}
