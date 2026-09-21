import httpStatus from "http-status";
import { Prisma, Status } from "@prisma/client";
import ApiError from "../errors/ApiError";
import prisma from "../../shared/prisma";
import {
	CreateTaskInput,
	UpdateTaskInput,
	TaskQueryInput,
	MoveTaskInput,
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
	const orderBy = sortBy === "createdAt"
		? [{ position: "asc" as const }, { createdAt: sortOrder }]
		: { [sortBy]: sortOrder };

	const [data, total] = await Promise.all([
		prisma.task.findMany({
			where,
			skip,
			take: limit,
			orderBy,
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
	const status = payload.status === "In Progress" ? Status.In_Progress : payload.status || Status.Pending;
	const lastTask = await prisma.task.findFirst({
		where: { status },
		orderBy: { position: "desc" },
		select: { position: true },
	});

	return prisma.task.create({
		data: {
			...payload,
			status,
			position: (lastTask?.position ?? -1) + 1,
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

const moveTask = async (id: number, payload: MoveTaskInput) => {
	const targetStatus = payload.targetStatus === "In Progress"
		? Status.In_Progress
		: payload.targetStatus;
	const task = await getTaskById(id);
	const targetPosition = Math.max(0, payload.targetPosition);

	return prisma.$transaction(async (transaction) => {
		if (task.status === targetStatus) {
			if (targetPosition > task.position) {
				await transaction.task.updateMany({
					where: {
						status: targetStatus,
						position: { gt: task.position, lte: targetPosition },
					},
					data: { position: { decrement: 1 } },
				});
			} else if (targetPosition < task.position) {
				await transaction.task.updateMany({
					where: {
						status: targetStatus,
						position: { gte: targetPosition, lt: task.position },
					},
					data: { position: { increment: 1 } },
				});
			}
		} else {
			await transaction.task.updateMany({
				where: { status: task.status, position: { gt: task.position } },
				data: { position: { decrement: 1 } },
			});
			await transaction.task.updateMany({
				where: { status: targetStatus, position: { gte: targetPosition } },
				data: { position: { increment: 1 } },
			});
		}

		return transaction.task.update({
			where: { id },
			data: { status: targetStatus, position: targetPosition },
		});
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
	moveTask,
	deleteTask,
};
