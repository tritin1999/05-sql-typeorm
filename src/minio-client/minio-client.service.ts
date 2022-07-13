import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import { BufferedFile } from './file.model';
import * as crypto from 'crypto';
import { extname } from 'path';

@Injectable()
export class MinioClientService {
    private readonly logger: Logger;
    private readonly bucketName = process.env.MINIO_BUCKET_NAME;

    constructor(private readonly minio: MinioService) {
        this.logger = new Logger('MinioService');
    }

    public get client() {
        return this.minio.client;
    }

    public async upload(
        file: BufferedFile,
        bucketName: string = this.bucketName,
    ) {
        if (!(file.mimetype.includes('jpg')
            || file.mimetype.includes('mp4')
            || file.mimetype.includes('HEIC')
            || file.mimetype.includes('gif')
            || file.mimetype.includes('avi')
            || file.mimetype.includes('jpeg')
            || file.mimetype.includes('png'))) {
            throw new HttpException(
                'File type is not supported',
                HttpStatus.BAD_REQUEST,
            );
        }
        else {
            const name = file.originalname.split('.')[0];
            const fileExtName = extname(file.originalname);
            const randomName = Array(4)
                .fill(null)
                .map(() => Math.round(Math.random() * 16).toString(16))
                .join('');
            const dateTime = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate();
            var time = new Date().getHours() + "-" + new Date().getMinutes() + "-" + new Date().getSeconds();

            const fileName = `${name}_${dateTime}_${time}_${randomName}${fileExtName}`;
            const url = `${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${process.env.MINIO_BUCKET_NAME}/${fileName}`;
            this.client.putObject(
                bucketName,
                fileName,
                file.buffer,
                function (err, res) {
                    if (err) {
                        throw new HttpException(
                            'Error uploading file',
                            HttpStatus.BAD_REQUEST,
                        );
                    }
                },
            );
            return {
                filename: fileName,
                originalname: file.originalname,
                size: file.size,
                mimetype: file.mimetype,
                destination: url,
                path: url,
                url: url,
            };
        }
    }

    async delete(objectName: string, bucketName: string = this.bucketName) {
        this.client.removeObject(bucketName, objectName, function (err) {
            if (err)
                throw new HttpException(
                    'An error occured when deleting!',
                    HttpStatus.BAD_REQUEST,
                );
        });
    }
}