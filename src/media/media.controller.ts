import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, NotAcceptableException, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { MediaService } from './media.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { isNotEmpty, isNotEmptyObject } from 'class-validator';
import { HttpException } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { BufferedFile } from 'src/minio-client/file.model';

@Controller('api/medias')
export class MediaController {
  constructor(private mediaService: MediaService) { }

  @Post('/upload-single')
  @UseInterceptors(FileInterceptor('mediafile'))
  async uploadSingleFile(@UploadedFile() file: BufferedFile) {
    try {
      if (isNotEmpty(file) && isNotEmptyObject(file))
        return await this.mediaService.create(file);
    } catch (err) {
      console.log(err);
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'Exception occurs, please check with system manager',
      }, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('/upload-multiple')
  @UseInterceptors(FilesInterceptor('mediafile'))
  async uploadMultipleFiles(@UploadedFiles() files) {
    try {
      await files.forEach(file => {
        if (isNotEmpty(file))
          this.mediaService.create(file);
      });
    } catch (err) {
      console.log(err);
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'Exception occurs, please check with system manager',
      }, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll() {
    return await this.mediaService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.mediaService.findOne(+id);
  }

  @Get('getByName/:name')
  async findByName(@Param('name') name: string) {
    return await this.mediaService.findByName(name);
  }

  @UseInterceptors(FileInterceptor('mediafile'))
  @Patch(':id')
  async update(@Param('id') id: number, @UploadedFile() file) {
    try {
      if (isNotEmpty(file) && isNotEmptyObject(file))
        return await this.mediaService.update(id, file);
    } catch (err) {
      console.log(err);
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'Exception occurs, please check with system manager',
      }, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.mediaService.remove(id);
  }
}
