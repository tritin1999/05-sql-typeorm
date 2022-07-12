import { MaxLength, IsNotEmpty, IsString, isString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";


export class CreateMediaDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MaxLength(240)
    originalName: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MaxLength(240)
    mediaName: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    mediaSize: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MaxLength(5)
    format: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MaxLength(5)
    mediaType: string;

    @ApiProperty()
    @IsString()
    @MaxLength(20)
    @IsOptional()
    mediaURL: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    @MaxLength(240)
    thumbnailURL: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MaxLength(240)
    permaURL: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    timeStamp: string;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    refID: number;
}
