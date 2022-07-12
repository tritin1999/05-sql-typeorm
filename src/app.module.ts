import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from './media/entities/media.entity';
import { MediaModule } from './media/media.module';

@Module({
  imports: [
    MediaModule,
  ],
})
export class AppModule { }
