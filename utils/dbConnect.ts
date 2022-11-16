import mongoose, { Mongoose } from "mongoose";
import dotenv from "dotenv";
import { ConnectionOptions } from "tls";

dotenv.config();

const MONGODB_URI: string = process.env.MONGODB_URI || "";

if (!MONGODB_URI) throw new Error("Set the URI in the environment variables!");

const connection: { isConnected?: number } = {};

async function dbConnect() {
  //check for active connections
  if (connection.isConnected) return;

  //connect to mongo
  const db: Mongoose = await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectionOptions);

  connection.isConnected = db.connections[0].readyState;
}

export default dbConnect;
