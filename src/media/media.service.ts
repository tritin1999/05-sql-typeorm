import { HttpException, HttpStatus, Injectable, NotAcceptableException, NotFoundException, UploadedFile } from '@nestjs/common';
import { isNotEmpty } from 'class-validator';
import { getDataSource } from 'src/datasource';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { Media } from './entities/media.entity';
import { MediaRepository } from './media.repository';

@Injectable()
export class MediaService {

  async create(@UploadedFile() file) {
    try {
      const media = await this.mapFromFileToCreateMediaDto(file);
      return await (await MediaRepository).save(media);
    } catch (err) {
      console.log(err);
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(): Promise<Media[]> {
    return await (await MediaRepository).find();
  }

  async findOne(id: number): Promise<Media> {
    const item = await (await MediaRepository).findOneBy({ id })
    if (!item) {
      throw new NotFoundException(`Mediafile #${id} not found`);
    }
    return item;
  }

  async findByName(name: string): Promise<Media> {
    const item = await (await MediaRepository).findByName(name);
    if (!item || item !== isNotEmpty) {
      throw new NotFoundException(`Mediafile #${name} not found`);
    }
    return item;
  }

  public async update(
    id: number,
    @UploadedFile() file
  ) {
    if (!id) {
      throw new NotAcceptableException(`Mediafile id is not exists`)
    }
    else if (await this.findOne(id) === null) {
      throw new NotFoundException(`Mediafile #${id} not found`);
    }
    else {
      console.log(file);
      const media = await this.mapFromFileToUpdateMediaDto(id, file);
      return await (await MediaRepository).save(media);
    }
  }

  async remove(id: number): Promise<void> {
    if (await this.findOne(id) === null) {
      throw new NotFoundException(`Mediafile #${id} not found`);
    }
    await (await MediaRepository).delete(id);
  }

  private async mapFromFileToCreateMediaDto(@UploadedFile() file) {
    const item: CreateMediaDto = new CreateMediaDto();
    this.mapData(item, file);
    return item;
  }

  private async mapFromFileToUpdateMediaDto(id: number, @UploadedFile() file) {
    const item: UpdateMediaDto = new UpdateMediaDto();
    item.id = parseInt(id.toString());
    this.mapData(item, file);
    return item;
  }

  private async mapData(item, file) {
    item.mediaName = file.filename;
    item.format = file.originalname.substr(file.originalname.lastIndexOf('.') + 1);
    item.mediaSize = file.size;
    item.mediaType = file.mimetype.includes("image") ? "Image" : "Video";
    item.originalName = file.originalname;
    item.permaURL = file.destination;
    item.mediaURL = file.path;
    item.thumbnailURL = null;
    item.timeStamp = new Date().valueOf().toString();
  }
}
