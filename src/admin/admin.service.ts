import { HttpStatus, Injectable } from '@nestjs/common';
import { SchoolDTO, SchoolListDTO } from './DTO/school.dto';
import { CustomError } from 'src/common/helpers/exceptions';
import { InjectModel } from '@nestjs/mongoose';
import { Admin, AdminDocument } from 'src/schemas/admin.schema';
import mongoose, { Model, PipelineStage } from 'mongoose';
import { School } from 'src/schemas/school.schema';
import { hash } from 'bcrypt';
import { Student } from 'src/schemas/student.schema';
import { SchoolStudentListDTO } from './DTO/student.dto';
import { generatePassword } from 'src/utils';
import { UserRole } from 'src/common/auth/DTO/signin.dto';
import { EmailService } from 'src/common/services/email.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly emailService: EmailService,
    @InjectModel(Admin.name)
    private readonly adminModel: Model<AdminDocument>,
    @InjectModel(School.name)
    private readonly schoolModule: Model<School>,
    @InjectModel(Student.name)
    private readonly studentModule: Model<Student>,
  ) {}

  async findSchool(schooltId: string) {
    const findSchool = await this.schoolModule.findById({
      _id: schooltId,
    });

    return findSchool;
  }

  async createAdmin() {
    const adminCred = {
      email: 'rootadmin@yopmail.com',
      password: 'Admin@123',
    };

    const findAdmin = await this.adminModel.findOne({ email: adminCred.email });

    if (!findAdmin) {
      const hashPassword = await hash(adminCred.password, 10);
      adminCred.password = hashPassword;

      (await this.adminModel.create(adminCred)).save();
    }
  }

  async createSchool(schoolDTO: SchoolDTO) {
    try {
      const findSchoolByEmail = await this.schoolModule.findOne({
        email: schoolDTO.email,
      });

      if (findSchoolByEmail) {
        throw CustomError.customException(
          'School already exist with same email',
          HttpStatus.BAD_REQUEST,
        );
      }

      const autoGenratePassword = await generatePassword();

      const hashPassword = await hash(autoGenratePassword, 10);

      const addSchool = await this.schoolModule.create({
        ...schoolDTO,
        password: hashPassword,
        role: UserRole.School,
      });

      this.emailService.loginInfoMail(
        autoGenratePassword,
        schoolDTO.email,
        'Login credentials',
      );

      return addSchool;
    } catch (error) {
      throw CustomError.customException(
        error.message,
        error.statusCode ?? HttpStatus.BAD_REQUEST,
      );
    }
  }

  async editSchool(id: string, schoolDTO: SchoolDTO) {
    try {
      const findSchool = await this.findSchool(id);

      if (!findSchool) {
        throw CustomError.customException(
          'School not exist',
          HttpStatus.BAD_REQUEST,
        );
      }

      const editSchoolData = await this.schoolModule.findOneAndUpdate(
        { _id: id },
        { ...schoolDTO },
        { new: true },
      );

      return editSchoolData;
    } catch (error) {
      throw CustomError.customException(
        error.message,
        error.statusCode ?? HttpStatus.BAD_REQUEST,
      );
    }
  }

  async schoolDetail(id: string) {
    try {
      const findSchool = await this.findSchool(id);

      if (!findSchool) {
        throw CustomError.customException(
          'School not exist',
          HttpStatus.BAD_REQUEST,
        );
      }
      return findSchool;
    } catch (error) {
      throw CustomError.customException(
        error.message,
        error.statusCode ?? HttpStatus.BAD_REQUEST,
      );
    }
  }

  async schoolList(schoolListDTO: SchoolListDTO) {
    try {
      const limit = schoolListDTO.limit ?? 10;
      const offset = schoolListDTO.offset ?? 0;

      const aggregatQuery = [];

      // city filter
      if (Array.isArray(schoolListDTO.city) && schoolListDTO.city?.length > 0) {
        aggregatQuery.push({
          $match: {
            $expr: {
              $in: ['$city', schoolListDTO.city],
            },
          },
        });
      }

      // searching
      if (schoolListDTO.search) {
        const searchRegex = new RegExp(schoolListDTO.search, 'i');

        const or = [
          { name: searchRegex },
          { email: searchRegex },
          { city: searchRegex },
          { address: searchRegex },
          { zipCode: searchRegex },
          { state: searchRegex },
          { country: searchRegex },
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

      if (schoolListDTO.sortOrder && schoolListDTO.sortBy) {
        sortOrder = schoolListDTO.sortOrder === 'asc' ? 1 : -1;
        sortBy = schoolListDTO.sortBy ?? 'createdAt';
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
              email: '$email',
              address: '$address',
              zipCode: '$zipCode',
              city: '$city',
              state: '$state',
              country: '$country',
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

      let schoolList = await this.schoolModule.aggregate(aggregatQuery);

      if (schoolList && !schoolList[0]) {
        schoolList = [
          {
            recordsTotal: 0,
            recordsFiltered: 0,
            result: [],
          },
        ];
      }

      return schoolList[0];
    } catch (error) {
      throw CustomError.customException(
        error.message,
        error.statusCode ?? HttpStatus.BAD_REQUEST,
      );
    }
  }

  async studentOfSchool(studentListDTO: SchoolStudentListDTO) {
    try {
      if (studentListDTO.schoolId) {
        const findSchool = await this.findSchool(studentListDTO.schoolId);
        console.log('findSchool: ', findSchool);

        if (!findSchool) {
          throw CustomError.customException(
            'School not exist',
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      const limit = studentListDTO.limit ?? 10;
      const offset = studentListDTO.offset ?? 0;

      const aggregatQuery = [];

      aggregatQuery.push({
        $match: {
          isDelete: false,
        },
      });

      // find school
      if (studentListDTO.schoolId) {
        aggregatQuery.push({
          $match: {
            schoolId: new mongoose.Types.ObjectId(studentListDTO.schoolId),
          },
        });
      }

      aggregatQuery.push({
        $lookup: {
          from: 'school',
          localField: 'schoolId',
          foreignField: '_id',
          as: 'schoolDetail',
        },
      });

      aggregatQuery.push({
        $addFields: {
          schoolDetail: { $arrayElemAt: ['$schoolDetail', 0] },
        },
      });

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
              photo: '$photo',
              dob: '$dob',
              schoolDetail: {
                schoolId: '$schoolDetail._id',
                name: '$schoolDetail.name',
                email: '$schoolDetail.email',
              },
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

      return studentList;
    } catch (error) {
      throw CustomError.customException(
        error.message,
        error.statusCode ?? HttpStatus.BAD_REQUEST,
      );
    }
  }
}
