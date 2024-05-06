import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const host = configService.get<string>('DATABASE_HOST');
        const port = configService.get<string>('DATABASE_PORT');
        const dbname = configService.get<string>('DATABASE_NAME');
        const options: MongooseModuleOptions = {
          uri: `mongodb://${host}:${port}/${dbname}`,
        };
        return options;
      },
    }),
  ],
})
export class DatabaseModule {}
