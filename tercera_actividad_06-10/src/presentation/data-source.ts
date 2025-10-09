import "reflect-metadata";
import { DataSource } from "typeorm";
import { config } from "dotenv";
import { GymClass, Coach, Machine, User, Membership, Payment, Plan, Admin } from "../domain/models";

// Cargar variables de entorno
config();

export const AppDataSource = new DataSource({
    type: process.env.DB_TYPE as "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: process.env.NODE_ENV === "development",
    logging: process.env.NODE_ENV === "development",
    entities: [GymClass, Coach, Machine, User, Membership, Payment, Plan, Admin],
    migrations: [],
    subscribers: [],
    ssl: {
        rejectUnauthorized: false
    }
});