import { Module } from '@nestjs/common';
import { StudentService } from './school.service';
import { StudentController } from './school.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/common/auth/auth.module';
import { Student, StudentSchema } from 'src/schemas/student.schema';
import { StudentDetailService } from 'src/common/services/student.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Student.name, schema: StudentSchema }]),
    AuthModule,
  ],
  providers: [StudentService, StudentDetailService],
  controllers: [StudentController],
})
export class StudentModule {}
