import "dotenv/config";
import app from "./app.js";

const PORT = Number(process.env.PORT) || 4000;

const server = app.listen(PORT, () => {
  console.log(`PosMat API running on http://localhost:${PORT}`);
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(
      `Port ${PORT} is already in use. Stop the existing server or set a different PORT in server/.env.`
    );
    process.exit(1);
  }

  console.error("Failed to start PosMat API:", error);
  process.exit(1);
});
