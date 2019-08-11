#!/usr/bin/env node
import 'module-alias/register';
import 'reflect-metadata';
import mongoose from 'mongoose';
import { GraphQLServer } from 'graphql-yoga';
import { buildSchema, GeneratingSchemaError } from 'type-graphql';

import PlayerResolver from '@spacebar-server/resolvers/PlayerResolver';


const MONGODB = 'mongodb://localhost:9100/players';

const startServer = async () => {
  const schema = await buildSchema({
    resolvers: [PlayerResolver],
    emitSchemaFile: true,
  });

  const server = new GraphQLServer({
    schema,
  });

  server.start({ port: 9000 }, () => {
    console.log('Server is running on port 9000');
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
  })