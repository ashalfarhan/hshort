import chalk from "chalk";
import mongoose from "mongoose";

export default async function () {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    });
    console.log(chalk.cyan(`[database] MongoDB Connected`));
  } catch (error) {
    console.error(chalk.red(`[database] Error: ${error.message}`));
    process.exit(1);
  }
}
