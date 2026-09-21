import httpStatus from "http-status";
import ApiError from "../errors/ApiError";
import prisma from "../../shared/prisma";
import { CreateTaskInput, UpdateTaskInput } from "./task.interface";

const getTasks = async () => {
	return prisma.task.findMany({
		orderBy: { createdAt: "desc" },
	});
};

const getTaskById = async (id: number) => {
	const task = await prisma.task.findUnique({ where: { id } });

	if (!task) {
		throw new ApiError(httpStatus.NOT_FOUND, "Task not found");
	}

	return task;
};

const createTask = async (payload: CreateTaskInput) => {
	return prisma.task.create({ data: payload });
};

const updateTask = async (id: number, payload: UpdateTaskInput) => {
	await getTaskById(id);

	return prisma.task.update({
		where: { id },
		data: payload,
	});
};

const deleteTask = async (id: number) => {
	await getTaskById(id);

	return prisma.task.delete({ where: { id } });
};

export const taskService = {
	getTasks,
	getTaskById,
	createTask,
	updateTask,
	deleteTask,
};
