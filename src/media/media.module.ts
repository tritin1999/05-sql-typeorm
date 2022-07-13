import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { MinioClientModule } from 'src/minio-client/minio-client.module';

@Module({
  controllers: [MediaController],
  providers: [MediaService],
  imports: [MinioClientModule],
})
export class MediaModule {}
