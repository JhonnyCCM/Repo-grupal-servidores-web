import "reflect-metadata";
import { DataSource } from "typeorm";
import { GymClassModel } from "../domain/models/gym-class.model";
import { CoachModel } from "../domain/models/coach.model";
import { MachineModel } from "../domain/models/machine.model";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "dpg-d3htns95pdvs73fim10g-a.oregon-postgres.render.com", // <-- CORRECCIÓN: Solo el host, sin "postgresql://"
    port: 5432,
    username: "gymdemo_user",
    password: "Xy5t2yPMRhfHYnySepEyyxZqSB6R26fR",
    database: "gymdemo",
    synchronize: true,
    logging: false,
    entities: [GymClassModel, CoachModel, MachineModel],
    migrations: [],
    subscribers: [],
    ssl: {
        rejectUnauthorized: false
    }
});