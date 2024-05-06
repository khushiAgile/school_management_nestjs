import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { Admin, AdminSchema } from 'src/schemas/admin.schema';
import { JWTTokenService } from '../jwt/jwt.token.service';
import { School, SchoolSchema } from 'src/schemas/school.schema';

@Module({
  imports: [
    JwtModule,
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
    MongooseModule.forFeature([{ name: School.name, schema: SchoolSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JWTTokenService],
})
export class AuthModule {}
