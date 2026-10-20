
import "dotenv/config";
import app from "./app";
import { connectDb } from "./config/db";

async function startServer(): Promise<void> {
  try {
    await connectDb();

    const port = Number(process.env.PORT ?? 3000);

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exitCode = 1;
  }
}

void startServer();

