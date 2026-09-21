import { Prisma } from "@prisma/client";

export type TaskStatus = "Pending" | "In Progress" | "Completed";
export type TaskPriority = "Low" | "Medium" | "High";

export type CreateTaskInput = Omit<Prisma.TaskCreateInput, "status" | "priority"> & {
	status?: TaskStatus;
	priority?: TaskPriority;
};

export type UpdateTaskInput = Omit<Prisma.TaskUpdateInput, "status" | "priority"> & {
	status?: TaskStatus;
	priority?: TaskPriority;
};

export type UpdateTaskStatusPriorityInput = {
	status?: TaskStatus;
	priority?: TaskPriority;
};

export type TaskQueryInput = {
	search?: string;
	status?: TaskStatus;
	priority?: TaskPriority;
	page?: number;
	limit?: number;
	sortBy?: "createdAt" | "updatedAt" | "title" | "priority" | "status";
	sortOrder?: "asc" | "desc";
};