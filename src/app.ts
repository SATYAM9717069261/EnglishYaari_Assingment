import express from "express";
import userRoutes from "./routes/user.routes";
import teacherRoutes from "./routes/teacher.routes";
import sessionRoutes from "./routes/session.route";

const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
  });
});
app.use("/users", userRoutes);
app.use("/teachers", teacherRoutes);
app.use("/sessions", sessionRoutes);

export default app;

