#!/usr/bin/env node
import 'module-alias/register';
import 'reflect-metadata';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { GraphQLServer } from 'graphql-yoga';
import { buildSchema, GeneratingSchemaError } from 'type-graphql';

import { PlayerResolver } from '@spacebar-server/resolvers';


dotenv.config();

const { DB_HOST = 'localhost', DB_PORT = 9100 } = process.env;
const MONGODB = `mongodb://${DB_HOST}:${DB_PORT}/players`;

const startServer = async () => {
  const schema = await buildSchema({
    resolvers: [PlayerResolver],
    emitSchemaFile: true,
  });

  const server = new GraphQLServer({
    schema,
  });

  const { GQL_PORT = 9000 } = process.env;
  server.start({ port: GQL_PORT }, () => {
    console.log(`Server is running on port ${GQL_PORT}.`);
  });
};

mongoose.set('debug', true);
mongoose.connect(MONGODB, {
  promiseLibrary: Promise,
  useNewUrlParser: true,
});


startServer()
  .catch(console.error)
  .catch((e: GeneratingSchemaError) => {
    e.details.forEach(detail => {
      console.error(detail.message);
    });
    process.exit(1);
  });