import mongoose from "mongoose";
import dotenv  from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const url = process.env.MONGO_URI;


export default async function connectDB() {
  if (mongoose.connection.readyState !== 0) {
    return;
  }

  try {
    await mongoose.connect(url);
    console.log("Connected to mongodb");
    
  }catch(err) {
    console.log("Error connecting to mongodb:", err);
    process.exit(1);
  }
  
};
