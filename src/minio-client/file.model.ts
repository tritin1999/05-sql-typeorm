export interface BufferedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: AppMimeType;
  size: number;
  destination: string;
  path: string
  buffer: Buffer | string;
}

export interface StoredFile extends HasFile, StoredFileMetadata { }

export interface HasFile {
  file: Buffer | string;
}

export interface StoredFileMetadata {
  id: string;
  name: string;
  encoding: string;
  mimetype: AppMimeType;
  size: number;
  updatedAt: Date;
  fileSrc?: string;
}

export type AppMimeType = 'image/jpg' | 'image/jpeg' | 'image/png' | 'image/HEIC' | 'image/gif' | 'video/mp4' | 'video/avi';
