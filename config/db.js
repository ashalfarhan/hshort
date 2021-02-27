import mongoose from "mongoose";

export default async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    });

    console.log(
      "%s\x1b[36m",
      `\n > MongoDB Connected: ${conn.connection.host} \n`
    );
  } catch (error) {
    console.error(`Database Error: ${error.message}`);
    process.exit(1);
  }
}
