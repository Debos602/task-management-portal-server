import httpStatus from "http-status";
import { Prisma, Status } from "@prisma/client";
import ApiError from "../errors/ApiError";
import prisma from "../../shared/prisma";
import {
	CreateTaskInput,
	UpdateTaskInput,
	UpdateTaskStatusPriorityInput,
	TaskQueryInput,
} from "./task.interface";


const getTasks = async (query: TaskQueryInput) => {
	const page = Number(query.page) || 1;
	const limit = Number(query.limit) || 10;
	const skip = (page - 1) * limit;
	const status = query.status === "In Progress" ? Status.In_Progress : query.status;
	const where: Prisma.TaskWhereInput = {
		...(status && { status }),
		...(query.priority && { priority: query.priority }),
		...(query.search && {
			OR: [
				{ title: { contains: query.search, mode: "insensitive" } },
				{ description: { contains: query.search, mode: "insensitive" } },
			],
		}),
	};
	const sortBy = query.sortBy || "createdAt";
	const sortOrder = query.sortOrder || "desc";

	const [data, total] = await Promise.all([
		prisma.task.findMany({
			where,
			skip,
			take: limit,
			orderBy: { [sortBy]: sortOrder },
		}),
		prisma.task.count({ where }),
	]);

	return {
		data,
		meta: { page, limit, total },
	};
};

const getDashboardState = async () => {
	const [totalTasks, statusCounts, priorityCounts, recentTasks] = await Promise.all([
		prisma.task.count(),
		prisma.task.groupBy({
			by: ["status"],
			_count: { _all: true },
		}),
		prisma.task.groupBy({
			by: ["priority"],
			_count: { _all: true },
		}),
		prisma.task.findMany({
			orderBy: { createdAt: "desc" },
			take: 5,
		}),
	]);

	const countsByKey = <T extends string>(
		counts: Array<{ _count: { _all: number }; [key: string]: T | { _all: number }}>,
		key: string,
	) => Object.fromEntries(counts.map((item) => [item[key], item._count._all]));

	return {
		totalTasks,
		statusCounts: countsByKey(statusCounts, "status"),
		priorityCounts: countsByKey(priorityCounts, "priority"),
		recentTasks,
	};
};

const getTaskById = async (id: number) => {
	const task = await prisma.task.findUnique({ where: { id } });

	if (!task) {
		throw new ApiError(httpStatus.NOT_FOUND, "Task not found");
	}

	return task;
};

const createTask = async (payload: CreateTaskInput) => {
	return prisma.task.create({
		data: {
			...payload,
			status:
				payload.status === "In Progress"
					? Status.In_Progress
					: payload.status,
		},
	});
};

const updateTask = async (id: number, payload: UpdateTaskInput) => {
	await getTaskById(id);
	const { status, ...taskData } = payload;

	return prisma.task.update({
		where: { id },
		data: {
			...taskData,
			...(status !== undefined && {
				status: status === "In Progress" ? Status.In_Progress : status,
			}),
		},
	});
};

const updateTaskStatusPriority = async (
	id: number,
	payload: UpdateTaskStatusPriorityInput,
) => {
	await getTaskById(id);

	return prisma.task.update({
		where: { id },
		data: {
			...(payload.priority !== undefined && { priority: payload.priority }),
			...(payload.status !== undefined && {
				status: payload.status === "In Progress" ? Status.In_Progress : payload.status,
			}),
		},
	});
};

const deleteTask = async (id: number) => {
	await getTaskById(id);

	return prisma.task.delete({ where: { id } });
};

export const taskService = {
	getTasks,
	getDashboardState,
	getTaskById,
	createTask,
	updateTask,
	updateTaskStatusPriority,
	deleteTask,
};
