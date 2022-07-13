import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from './media/entities/media.entity';
import { MediaModule } from './media/media.module';
import { MinioClientModule } from './minio-client/minio-client.module';

@Module({
  imports: [
    MediaModule,
    MinioClientModule,
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/.env.${process.env.NODE_ENV}`,
      isGlobal: true,
    })
  ],
})
export class AppModule { }
