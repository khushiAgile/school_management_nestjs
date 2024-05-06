import { HttpStatus, Injectable } from '@nestjs/common';
import { CustomError } from 'src/common/helpers/exceptions';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, PipelineStage } from 'mongoose';
import { Student, StudentDocument } from 'src/schemas/student.schema';
import {
  StudentDTO,
  StudentListDTO,
  StudentStatusDTO,
} from './DTO/student.dto';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(Student.name)
    private readonly studentModule: Model<StudentDocument>,
  ) {}

  async findStudent(studentId: string) {
    const findStudent = await this.studentModule.findById({
      _id: studentId,
    });

    return findStudent;
  }

  async createStudent(studentDTO: StudentDTO, req: any) {
    try {
      const addStudent = await this.studentModule.create({
        ...studentDTO,
        schoolId: req.user.id,
      });

      return addStudent;
    } catch (error) {
      throw CustomError.customException(
        error.message,
        error.statusCode ?? HttpStatus.BAD_REQUEST,
      );
    }
  }

  async editStudent(id: string, studentDTO: StudentDTO) {
    try {
      const findSchool = await this.findStudent(id);

      if (!findSchool) {
        throw CustomError.customException(
          'Student not exist',
          HttpStatus.BAD_REQUEST,
        );
      }

      const editStudentData = await this.studentModule.findOneAndUpdate(
        { _id: id },
        { ...studentDTO },
        { new: true },
      );

      return editStudentData;
    } catch (error) {
      throw CustomError.customException(
        error.message,
        error.statusCode ?? HttpStatus.BAD_REQUEST,
      );
    }
  }

  async studentList(studentListDTO: StudentListDTO) {
    try {
      const limit = studentListDTO.limit ?? 10;
      const offset = studentListDTO.offset ?? 0;

      const aggregatQuery = [];

      aggregatQuery.push({
        $match: {
          isDelete: false,
        },
      });

      // school filter
      if (studentListDTO.schoolId) {
        aggregatQuery.push({
          $match: {
            schoolId: new mongoose.Types.ObjectId(studentListDTO.schoolId),
          },
        });
      }

      // std filter
      if (studentListDTO.std) {
        aggregatQuery.push({
          $match: {
            $expr: {
              $in: ['$std', studentListDTO.std],
            },
          },
        });
      }

      // searching
      if (studentListDTO.search) {
        const searchRegex = new RegExp(studentListDTO.search, 'i');

        const or = [
          { name: searchRegex },
          { parentNumber: searchRegex },
          { std: searchRegex },
          { address: searchRegex },
          { dob: searchRegex },
        ];

        aggregatQuery.push({
          $match: {
            $or: or,
          },
        });
      }

      // sorting
      let sortOrder = -1;
      let sortBy = 'createdAt';

      if (studentListDTO.sortOrder && studentListDTO.sortBy) {
        sortOrder = studentListDTO.sortOrder === 'asc' ? 1 : -1;
        sortBy = studentListDTO.sortBy ?? 'createdAt';
      }

      aggregatQuery.push({
        $sort: { [sortBy]: sortOrder },
      } as PipelineStage);

      aggregatQuery.push({
        $group: {
          _id: null,
          count: { $sum: 1 },
          result: {
            $push: {
              _id: '$_id',
              name: '$name',
              parentNumber: '$parentNumber',
              address: '$address',
              std: '$std',
              dob: '$dob',
              photo: '$photo',
              createdAt: '$createdAt',
              updatedAt: '$updatedAt',
            },
          },
        },
      });

      aggregatQuery.push({
        $unwind: {
          path: '$result',
          preserveNullAndEmptyArrays: false,
        },
      });

      // pagination

      aggregatQuery.push({
        $skip: Number(offset),
      });

      aggregatQuery.push({
        $limit: Number(limit),
      });

      aggregatQuery.push({
        $group: {
          _id: null,
          recordsTotal: { $first: '$count' },
          recordsFiltered: { $sum: 1 },
          result: { $push: '$result' },
        },
      });

      aggregatQuery.push({
        $project: {
          _id: 0,
          recordsTotal: 1,
          recordsFiltered: 1,
          result: 1,
        },
      });

      let studentList = await this.studentModule.aggregate(aggregatQuery);

      if (studentList && !studentList[0]) {
        studentList = [
          {
            recordsTotal: 0,
            recordsFiltered: 0,
            result: [],
          },
        ];
      }

      return studentList[0];
    } catch (error) {
      throw CustomError.customException(
        error.message,
        error.statusCode ?? HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteStudent(studentId: string) {
    try {
      const findStudent = await this.findStudent(studentId);

      if (!findStudent || findStudent.isDelete) {
        throw CustomError.customException(
          'Student not exist',
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.studentModule.findByIdAndUpdate(
        studentId,
        {
          $set: { isDelete: true },
        },
        { new: true },
      );

      return {};
    } catch (error) {
      throw CustomError.customException(
        error.response.message,
        error.response.statusCode,
      );
    }
  }

  async statusStudent(statusData: StudentStatusDTO) {
    try {
      const findStudent = await this.findStudent(statusData.studentId);

      if (!findStudent || findStudent.isDelete) {
        throw CustomError.customException(
          'Student not exist',
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.studentModule.findByIdAndUpdate(
        statusData.studentId,
        {
          $set: { isActive: statusData.status },
        },
        { new: true },
      );

      return {};
    } catch (error) {
      throw CustomError.customException(
        error.response.message,
        error.response.statusCode,
      );
    }
  }
}
