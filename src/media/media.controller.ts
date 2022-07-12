import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, NotAcceptableException, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { MediaService } from './media.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { MediaDto } from './dto/get-media.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, mediaFileFilter } from '../shared/file-helpers';
import { isNotEmpty, isNotEmptyObject } from 'class-validator';
import { HttpException } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';


@Controller('api/medias')
export class MediaController {
  constructor(private mediaService: MediaService) { }

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
    try {
      if (file !== isNotEmpty || file !== isNotEmptyObject)
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
    try {
      if (files !== isNotEmpty || files !== isNotEmptyObject)
        await files.forEach(file => {
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
    try {
      if (file !== isNotEmpty || file !== isNotEmptyObject)
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
    try {
      return await this.mediaService.remove(id);
    } catch (err) {
      console.log(err);
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'Exception occurs, please check with system manager',
      }, HttpStatus.BAD_REQUEST);
    }
  }
}
