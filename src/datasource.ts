import "reflect-metadata";
import { DataSource } from "typeorm";
import { Media } from "./media/entities/media.entity";

const AppDataSource = new DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'root',
    database: 'socialapp',
    entities: [Media],
    synchronize: false,
    logging: true,
    migrations: [],
    subscribers: [],
});

AppDataSource.initialize()
    .then(async () => {
        console.log("Connection initialized with database...");
    })
    .catch((error) => console.log(error));

export const getDataSource = (delay = 3000): Promise<DataSource> => {
    if (AppDataSource.isInitialized) return Promise.resolve(AppDataSource);

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (AppDataSource.isInitialized) resolve(AppDataSource);
            else reject("Failed to create connection with database");
        }, delay);
    });
};
