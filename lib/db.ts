// MongoDB connection
import mongoose from "mongoose";

function getDatabaseUrl() {
  const url = process.env.DATABASE_URL;
  if (url == null) throw new Error('DATABASE_URL not found in environment')
  return url;
}

const url = getDatabaseUrl();
let connection: typeof mongoose;

const startDB = async () => {
  if (!connection) connection = await mongoose.connect(url);
  return connection;
};

export default startDB;
