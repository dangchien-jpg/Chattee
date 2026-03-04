import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_CONNECTION_STRING);
    console.log("Database connection successful");
  } catch (error) {
    console.log("Database connection failed");
    console.error(error);
    process.exit(1);
  }
};
