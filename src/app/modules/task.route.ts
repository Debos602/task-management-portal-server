import express from "express";
import { taskController } from "./task.controller";
import validateRequest from "../middlewares/validateRequest";
import { createTaskSchema } from "./task.validation";



const updateTaskSchema = createTaskSchema.shape.body.partial();

const router = express.Router();

router.get("/", taskController.getTasks);
router.get("/:id", taskController.getTaskById);
router.post("/", validateRequest(createTaskSchema), taskController.createTask);
router.put("/:id", validateRequest(updateTaskSchema), taskController.updateTask);
router.delete("/:id", taskController.deleteTask);

export default router;
