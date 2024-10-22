import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

export const connectdb = async (): Promise<void> => {
  if (connection.isConnected) {
    console.log("Already connected to the database");
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGO_URI || "", {});
    connection.isConnected = db.connections[0].readyState;
    console.log(connection.isConnected);
    console.log("database connected successfully");
  } catch (error) {
    console.error("Connection failed", error);
    process.exit(1);
  }
};
