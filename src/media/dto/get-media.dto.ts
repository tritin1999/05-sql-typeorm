import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { CreateMediaDto } from './create-media.dto';

export class MediaDto {
    originalName: string;
    mediaName: string;
    mediaSize: number;
    format: string;
    mediaType: string;
    mediaURL: string;
    thumbnailURL: string;
    permaURL: string;
    timeStamp: number;
    refID: number;
}
