import mongoose from "mongoose";

const connection = {};

async function dbConnect() {
  if (connection.isConnected) {
    console.log("MongoDB Already Connected!");
    return;
  }

  try {
    const connectionInstance = await mongoose.connect(
      process.env.MONGODB_URI || ""
    );


    connection.isConnected=connectionInstance.connections[0].readyState

    console.log(
      `\n MongoDB Connected !! DB_HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MongoDB connection error", error);
    process.exit(1);
  }
}

export default dbConnect;
