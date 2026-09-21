import express from "express";
import { taskController } from "./task.controller";
import validateRequest from "../middlewares/validateRequest";
import {
	createTaskSchema,
	taskIdParamSchema,
	taskQuerySchema,
	updateTaskStatusPrioritySchema,
} from "./task.validation";



const updateTaskSchema = createTaskSchema.shape.body.partial();

const router = express.Router();

router.get("/dashboard", taskController.getDashboardState);
router.get("/", validateRequest(taskQuerySchema), taskController.getTasks);
router.get("/:id", validateRequest(taskIdParamSchema), taskController.getTaskById);
router.post("/", validateRequest(createTaskSchema), taskController.createTask);
router.patch(
	"/:id/status-priority",
	validateRequest(taskIdParamSchema),
	validateRequest(updateTaskStatusPrioritySchema),
	taskController.updateTaskStatusPriority,
);
router.put(
	"/:id",
	validateRequest(taskIdParamSchema),
	validateRequest(updateTaskSchema),
	taskController.updateTask,
);
router.delete("/:id", validateRequest(taskIdParamSchema), taskController.deleteTask);

export default router;
