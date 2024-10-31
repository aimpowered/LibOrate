
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
let connection: Promise<mongoose.Connection>;

// // eslint-disable-next-line @typescript-eslint/no-namespace
// declare namespace globalThis {
//   export let dbCounter: number;
// }
// globalThis.dbCounter = 0;

const startDB = () => {
  if (!connection)  {
      console.log(`
        
================================================================
Starting database (important this this can only happen once!!!!)
================================================================

`);
//${globalThis.dbCounter++}
//${new Error().stack}
      connection = databaseUrl.then(mongoose.createConnection)
  }
  return connection;
};

export default startDB;
