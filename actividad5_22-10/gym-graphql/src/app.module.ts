// src/app.module.ts
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { HttpModule } from '@nestjs/axios';
import { join } from 'path';

@Module({
 imports: [
 GraphQLModule.forRoot({
 driver: ApolloDriver,
 autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
 sortSchema: true,
 playground: true, // Apollo Playground
 }),
 HttpModule.register({
 baseURL: 'http://localhost:3001', // URL del servicio REST
 timeout: 5000,
 maxRedirects: 5,
 }),
 // Aquí se importarán los módulos de resolvers
 ],
})
export class AppModule {}