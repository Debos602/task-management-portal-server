import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { taskService } from "./task.service";


const parseTaskId = (value: string) => Number(value);

const getTasks = catchAsync( async (_req: Request, res: Response) => {
	const result = await taskService.getTasks();

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Tasks retrieved successfully",
		data: result,
	});
});

const getTaskById = catchAsync(async (req: Request, res: Response) => {
	const result = await taskService.getTaskById(parseTaskId(req.params.id));

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Task retrieved successfully",
		data: result,
	});
});

const createTask = catchAsync(async (req: Request, res: Response) => {
	const result = await taskService.createTask(req.body);

	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: "Task created successfully",
		data: result,
	});
});

const updateTask = catchAsync(async (req: Request, res: Response) => {
	const result = await taskService.updateTask(parseTaskId(req.params.id), req.body);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Task updated successfully",
		data: result,
	});
});

const deleteTask = catchAsync(async (req: Request, res: Response) => {
	const result = await taskService.deleteTask(parseTaskId(req.params.id));

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Task deleted successfully",
		data: result,
	});
});

export const taskController = {
	getTasks,
	getTaskById,
	createTask,
	updateTask,
	deleteTask,
};
