import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import problemsRoutes from "./routes/problem.routes.js";
import executionRoutes from "./routes/execution.route.js";
import playlistRoutes from "./routes/playlist.routes.js";
import submissionRoutes from "./routes/submission.routes.js";

dotenv.config(

);

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res)=>{
    res.send("hello guys  welcome to leetlab")
})

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/problems", problemsRoutes);
app.use("/api/execute-code", executionRoutes);
app.use("/api/v1/playlist", playlistRoutes);
app.use("/api/v1/submission", submissionRoutes);

app.listen(process.env.PORT || 3000, () => {
    console.log("Server running on port 3000");
});