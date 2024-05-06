import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SigninDTO, UserRole } from './DTO/signin.dto';
import { JWTTokenService } from 'src/common/jwt/jwt.token.service';
import { AuthExceptions, CustomError } from '../helpers/exceptions';
import { Admin } from 'src/schemas/admin.schema';
import { compare } from 'bcrypt';
import { School } from 'src/schemas/school.schema';

@Injectable()
export class AuthService {
  constructor(
    private jwtTokenService: JWTTokenService,
    @InjectModel(Admin.name)
    private readonly adminModel: Model<Admin>,
    @InjectModel(School.name)
    private readonly schoolModel: Model<School>,
  ) {}

  async signin(signinData: SigninDTO) {
    try {
      let findUser;

      if (signinData.role === UserRole.Admin) {
        findUser = await this.adminModel.findOne({
          email: signinData.email,
        });
      }
      if (signinData.role === UserRole.School) {
        findUser = await this.schoolModel.findOne({
          email: signinData.email,
        });
      }

      if (findUser) {
        const comparePassword = await compare(
          signinData.password,
          findUser.password,
        );
        if (comparePassword) {
          const payload = {
            email: findUser.email,
            roles: signinData.role,
            id: findUser.id,
          };
          const signedToken = this.jwtTokenService.createToken(payload);

          findUser = findUser.toJSON();

          delete findUser.password;

          return { ...findUser, token: signedToken };
        } else {
          throw AuthExceptions.InvalidPassword();
        }
      } else {
        throw AuthExceptions.InavalidCredantial();
      }
    } catch (error) {
      throw CustomError.customException(
        error.response.message,
        error.response.statusCode,
      );
    }
  }
}
