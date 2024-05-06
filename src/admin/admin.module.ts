import { Module, OnModuleInit } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from 'src/schemas/admin.schema';
import { School, SchoolSchema } from 'src/schemas/school.schema';
import { AuthModule } from 'src/common/auth/auth.module';
import { Student, StudentSchema } from 'src/schemas/student.schema';
import { EmailService } from 'src/common/services/email.service';
import { StudentDetailService } from 'src/common/services/student.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Admin.name, schema: AdminSchema },
      { name: School.name, schema: SchoolSchema },
      { name: Student.name, schema: StudentSchema },
    ]),
    AuthModule,
  ],
  providers: [AdminService, EmailService, StudentDetailService],
  controllers: [AdminController],
})
export class AdminModule implements OnModuleInit {
  constructor(private adminService: AdminService) {}

  async onModuleInit() {
    await this.adminService.createAdmin();
  }
}
