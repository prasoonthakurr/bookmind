import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if(!MONGODB_URI){
  throw new Error("Please define the MONGODB_URI environment variable");
}

declare global {
  var mongooseCache:{
    conn: typeof mongoose | null,
    promise: Promise<typeof mongoose> | null
  }
}

const cached = global.mongooseCache || (global.mongooseCache = {
  conn: null,
  promise: null
});

export const connectToDB = async () => {
  if(cached.conn){
    return cached.conn;
  }

  if(!cached.promise){
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    })
  }

  try{
    cached.conn = await cached.promise;
  }catch(err){
    cached.promise = null;
    console.error("Error connecting to MongoDB:", err);
    throw err;
  }

  console.info("Successfully connected to MongoDB");
  return cached.conn;
}