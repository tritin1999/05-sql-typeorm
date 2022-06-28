import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { MediaModule } from './media/media.module';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'socialapp',
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    MediaModule,
  ],
})
export class AppModule {}
