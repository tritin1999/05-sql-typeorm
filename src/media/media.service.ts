import { HttpException, HttpStatus, Injectable, NotAcceptableException, NotFoundException, UploadedFile } from '@nestjs/common';
import { isNotEmpty, isNotEmptyObject } from 'class-validator';
import { BufferedFile } from 'src/minio-client/file.model';
import { MinioClientService } from 'src/minio-client/minio-client.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { Media } from './entities/media.entity';
import { MediaRepository } from './media.repository';

@Injectable()
export class MediaService {
  private readonly bucketName = process.env.MINIO_BUCKET_NAME;

  constructor(private minioClientService: MinioClientService) { }

  async create(file: BufferedFile) {
    var filename = '';
    try {
      const uploaded_file = await this.minioClientService.upload(file);
      filename = uploaded_file.filename;
      const media = await this.mapFromFileToCreateMediaDto(uploaded_file);
      await (await MediaRepository).save(media);
      return {
        file_url: uploaded_file.url,
        message: 'File uploaded successfully',
      };
    } catch (err) {
      const fileError = this.findByName(filename);
      if (isNotEmpty(fileError) && isNotEmptyObject(fileError))
        await this.minioClientService.delete(filename, this.bucketName);
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(): Promise<Media[]> {
    return await (await MediaRepository).find();
  }

  async findOne(id: number): Promise<Media> {
    const item = await (await MediaRepository).findOneBy({ id })
    if (!isNotEmpty(item) && !isNotEmptyObject(item)) {
      throw new NotFoundException(`Mediafile #${id} not found`);
    }
    return item;
  }

  async findByName(name: string): Promise<Media> {
    const item = await (await MediaRepository).findByName(name);
    if (!isNotEmpty(item) && !isNotEmptyObject(item)) {
      throw new NotFoundException(`Mediafile #${name} not found`);
    }
    return item;
  }

  public async update(
    id: number,
    @UploadedFile() file
  ) {
    var filename = '';
    if (!id) {
      throw new NotAcceptableException(`Mediafile id is not exists`)
    }
    else if (!isNotEmpty(await this.findOne(id))) {
      throw new NotFoundException(`Mediafile #${id} not found`);
    }
    else {

      try {
        const uploaded_file = await this.minioClientService.upload(file);
        filename = uploaded_file.filename;
        const media = await this.mapFromFileToUpdateMediaDto(id, uploaded_file);
        await (await MediaRepository).save(media);
        return {
          file_url: uploaded_file.url,
          message: 'File updated successfully',
        };
      } catch (err) {
        const fileError = this.findByName(filename);
        if (isNotEmpty(fileError) && isNotEmptyObject(fileError))
          await this.minioClientService.delete(filename, this.bucketName);
        throw new HttpException(err, HttpStatus.BAD_REQUEST);
      }
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const existedMedia = await this.findOne(id);
      if (!isNotEmpty(existedMedia) && !isNotEmptyObject(existedMedia)) {
        throw new NotFoundException(`Mediafile #${id} not found`);
      }
      this.minioClientService.delete(existedMedia.mediaName, this.bucketName);
      await (await MediaRepository).delete(id);
    }
    catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  private async mapFromFileToCreateMediaDto(file) {
    const item: CreateMediaDto = new CreateMediaDto();
    this.mapData(item, file);
    return item;
  }

  private async mapFromFileToUpdateMediaDto(id: number, file) {
    const item: UpdateMediaDto = new UpdateMediaDto();
    item.id = parseInt(id.toString());
    this.mapData(item, file);
    return item;
  }

  private async mapData(item, file) {
    console.log(file);
    item.mediaName = file.filename;
    item.format = file.originalname.substr(file.originalname.lastIndexOf('.') + 1);
    item.mediaSize = file.size;
    item.mediaType = file.mimetype.includes("image") ? "Image" : "Video";;
    item.originalName = file.originalname;
    item.permaURL = file.destination;
    item.mediaURL = file.path;
    item.thumbnailURL = '';
    item.timeStamp = new Date().valueOf().toString();
  }
}
