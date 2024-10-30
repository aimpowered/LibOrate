
// MongoDB connection
import mongoose from "mongoose";

async function getDatabaseUrl() {
  const url = process.env.DATABASE_URL;
  if (url == null) throw new Error('DATABASE_URL not found in environment')
  if (url === 'test') {
    // Only import 'mongodb-memory-server' when we really need it (in tests
    const {MongoMemoryServer} = await import('mongodb-memory-server')
    const mongoServer = await MongoMemoryServer.create();
    return mongoServer.getUri();
  }
  return url;
}

const databaseUrl = getDatabaseUrl();
let connection:  Promise<mongoose.Mongoose>;

const startDB = () => {
  if (!connection)  {
      connection = databaseUrl.then(mongoose.connect)
  }
  return connection;
};

export default startDB;
