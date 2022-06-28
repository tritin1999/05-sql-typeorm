import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { MEDIA_TYPE } from "./type";

@Entity('medias')
export class Media {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: "", type: 'varchar', length: 240, nullable: false })
    originalName: string;

    @Column({ default: "", type: 'varchar', length: 240, nullable: false })
    mediaName: string;

    @Column({ default: 0, nullable: false })
    mediaSize: number;

    @Column({ default: "", type: 'varchar', length: 5, nullable: false })
    format: string;

    @Column({ default: "", type: 'varchar', length: 5, nullable: false })
    mediaType: MEDIA_TYPE;

    @Column({ default: "", type: 'varchar', length: 240, nullable: true })
    mediaURL: string;

    @Column({ default: "", type: 'varchar', length: 240, nullable: true })
    thumbnailURL: string;
    
    @Column({ default: "", type: 'varchar', length: 240, nullable: false })
    permaURL: string;

    @Column({ default: "", nullable: false })
    timeStamp: string;

    @Column({ nullable: true })
    refID: number;

}
