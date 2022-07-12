import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, NotAcceptableException, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { MediaService } from './media.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { MediaDto } from './dto/get-media.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, mediaFileFilter } from '../shared/file-helpers';


@Controller('api/medias')
export class MediaController {
  constructor(private readonly mediaService: MediaService) { }

  @Post('/upload-single')
  @UseInterceptors(
    FileInterceptor('mediafile', {
      storage: diskStorage({
        destination: './uploads',
        filename: editFileName,
      }),
      fileFilter: mediaFileFilter,
    }),
  )
  async uploadSingleFile(@UploadedFile() file) {
    return await this.mediaService.create(file);
  }

  @Post('/upload-multiple')
  @UseInterceptors(
    FilesInterceptor('mediafile', 10, {
      storage: diskStorage({
        destination: './uploads',
        filename: editFileName,
      }),
      fileFilter: mediaFileFilter,
    }),
  )
  async uploadMultipleFiles(@UploadedFiles() files) {
    await files.forEach(file => {
      this.mediaService.create(file);
    });
  }

  @Get()
  async findAll() {
    return await this.mediaService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.mediaService.findOne(+id);
  }

  @UseInterceptors(
    FileInterceptor('mediafile', {
      storage: diskStorage({
        destination: './uploads',
        filename: editFileName,
      }),
      fileFilter: mediaFileFilter,
    }),
  )
  @Patch(':id')
  async update(@Param('id') id: number, @UploadedFile() file) {
    return await this.mediaService.update(id, file);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.mediaService.remove(id);
  }
}
