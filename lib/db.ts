// MongoDB connection
import mongoose from "mongoose";

const dataBaseUrlFromEnv: string = (() => {
  const url = process.env.DATABASE_URL;
  if (url == null) throw new Error("DATABASE_URL not found in environment");
  return url;
})();

let dynamicDatabaseUrl: Promise<string> | undefined = undefined;

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
  if (mongoose.connection.readyState === 1) {
    return Promise.resolve(mongoose);
  }
  if (mongoose.connection.readyState === 2) {
    return new Promise<mongoose.Mongoose>((resolve) => {
      mongoose.connection.once("connected", () => resolve(mongoose));
    });
  }
  console.log(`
================================================================
Starting database with URL: ${url}
================================================================
`);
  return mongoose.connect(url);
}

let mongooseObject: Promise<mongoose.Mongoose>;
const startDB = () => {
  if (!mongooseObject) {
    mongooseObject = getDatabaseUrl().then(createConnection);
  }
  return mongooseObject;
};

export default startDB;
