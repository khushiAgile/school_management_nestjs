import { Module } from '@nestjs/common';
import { AuthModule } from './common/auth/auth.module';
import { DatabaseModule } from './provider/database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './admin/admin.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AppIntercepter } from './common/interceptors/app.interceptors';
import { JwtAuthGuard } from './common/auth/guard/auth.guard';
import { FileUploadModule } from './common/fileUpload/fileUpload.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { StudentModule } from './school/school.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    AuthModule,
    AdminModule,
    FileUploadModule,
    StudentModule,
    DatabaseModule,
    DashboardModule,
    JwtModule.register({ global: true }),
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..'),
    }),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: AppIntercepter,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
