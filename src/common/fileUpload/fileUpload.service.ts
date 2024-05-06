import { HttpStatus, Injectable } from '@nestjs/common';
import { CustomError } from '../helpers/exceptions';

@Injectable()
export class FileUploadService {
  constructor() {}

  async fileUpload(file: any, { moduleName }: any) {
    try {
      if (!file) {
        throw CustomError.customException(
          'Image is required',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (!moduleName) {
        throw CustomError.customException(
          'moduleName is required',
          HttpStatus.BAD_REQUEST,
        );
      }

      const path = { filename: `${moduleName}/${file.filename}` };

      return path;
    } catch (error) {
      throw CustomError.customException(
        error.response.message,
        error.response.statusCode,
      );
    }
  }
}
