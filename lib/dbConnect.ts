import mongoose from "mongoose";

type ConnectionObj = {
  isConnected?: number | null;
};

const connection: ConnectionObj = {};

const dbConnect = async () => {
  if (connection.isConnected) {
    console.log("MongoDB is already connected");
    return;
  }

  const MONGO_DB_URL = process.env.MONGODB_URL; // or MONGODB_URI, just be consistent

  if (!MONGO_DB_URL) {
    console.error("MongoDB URI is not defined in environment variables");
    return;
  }

  try {
    const db = await mongoose.connect(MONGO_DB_URL, {
      maxPoolSize: 10,
      // remove dbName here if you already specify in URI
    });

    connection.isConnected = db.connections[0].readyState;
    console.log("MongoDB connected successfully");
    return db;
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    throw error; // optionally rethrow for caller to handle
  }
};

export default dbConnect;
