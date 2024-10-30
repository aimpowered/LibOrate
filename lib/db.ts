
// MongoDB connection
import mongoose from "mongoose";

// Only use type import for 'mongodb-memory-server' so that we don't need to always use it
import { type MongoMemoryServer } from 'mongodb-memory-server';

function getDatabaseUrl() {
  const url = process.env.DATABASE_URL;
  if (url == null) throw new Error('DATABASE_URL not found in environment')
  return url;
}

const databaseUrl = getDatabaseUrl();
let connection: MongoMemoryServer | mongoose.Mongoose;

const startDB = async (url:string = databaseUrl) => {
  if (!connection)  {
    if (url === 'test') {
      const {MongoMemoryServer} = await import('mongodb-memory-server')
      connection = await MongoMemoryServer.create();
    } else {
      connection = await mongoose.connect(url);
    }
  }
  return connection;
};

export default startDB;
