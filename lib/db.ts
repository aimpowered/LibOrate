// MongoDB connection
import mongoose from "mongoose";

const dataBaseUrlFromEnv:string = (() => {
  const url = process.env.DATABASE_URL;
  if (url == null) throw new Error("DATABASE_URL not found in environment");
  return url;
})();

let dynamicDatabaseUrl:Promise<string>|undefined = undefined;

function getDatabaseUrl() {
  if (dataBaseUrlFromEnv !== "test") {
    return Promise.resolve(dataBaseUrlFromEnv);
  }
  if (dynamicDatabaseUrl === undefined) {
    dynamicDatabaseUrl = computeDatabaseUrlForTesting();
  }
  return dynamicDatabaseUrl;

  async function computeDatabaseUrlForTesting() {
    // Only import 'mongodb-memory-server' when we really need it
    const { MongoMemoryServer } = await import("mongodb-memory-server");
    const mongoServer = await MongoMemoryServer.create();
    const newDatabaseUrl = mongoServer.getUri();
    process.env.DATABASE_URL = newDatabaseUrl;
    return newDatabaseUrl;
  }
}

function createConnection(url: string) {
    console.log(`
================================================================
Starting database with URL: ${url}
================================================================
`);
    return mongoose.createConnection(url);
}

let connection: Promise<mongoose.Connection>;
const startDB = () => {
  if (!connection) {
    connection = getDatabaseUrl().then(createConnection);
  }
  return connection;
};

export default startDB;
