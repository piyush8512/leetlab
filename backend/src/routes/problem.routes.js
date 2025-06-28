import express from "express";
import { authMiddleware, checkAdmin } from "../middleware/auth.middleware.js";
import { createProblem } from "../controllers/problem.controller.js";
import { getAllProblems } from "../controllers/problem.controller.js";
import { getProblemById } from "../controllers/problem.controller.js";
import { updateProblem } from "../controllers/problem.controller.js";
import { deleteProblem } from "../controllers/problem.controller.js";
import { getAllProblemsSolvedByUser } from "../controllers/problem.controller.js";

const problemRoutes = express.Router();


problemRoutes.post("/create-problem", authMiddleware, checkAdmin,createProblem)
problemRoutes.get("/get-all-problems" , authMiddleware , getAllProblems);
problemRoutes.get("/get-problem/:id" , authMiddleware , getProblemById);
problemRoutes.put("/update-problem/:id" , authMiddleware , checkAdmin , updateProblem)
problemRoutes.delete("/delete-problem/:id" , authMiddleware , checkAdmin , deleteProblem)
problemRoutes.get("/get-solved-problems" , authMiddleware , getAllProblemsSolvedByUser);


export default problemRoutes