// task.validation.ts
import { z } from "zod";

const taskPrioritySchema = z.preprocess(
  (value) => typeof value === "string" ? value.toLowerCase().replace(/^./, (character) => character.toUpperCase()) : value,
  z.enum(["Low", "Medium", "High"]),
);

const taskStatusSchema = z.preprocess(
  (value) => typeof value === "string"
    ? value.toLowerCase().replace(/(^|\s)\w/g, (character) => character.toUpperCase())
    : value,
  z.enum(["Pending", "In Progress", "Completed"]),
);

export const taskIdParamSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
});

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    priority: taskPrioritySchema.default("Medium"),
    status: taskStatusSchema.default("Pending"),
  }),
});

export const updateTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    priority: taskPrioritySchema.optional(),
    status: taskStatusSchema.optional(),
  }),
});

export const updateTaskStatusPrioritySchema = z.object({
  body: z.object({
    priority: taskPrioritySchema.optional(),
    status: taskStatusSchema.optional(),
  }).refine((body) => body.priority !== undefined || body.status !== undefined, {
    message: "Status or priority is required",
  }),
});

export const taskQuerySchema = z.object({
  query: z.object({
    search: z.string().trim().optional(),
    status: taskStatusSchema.optional(),
    priority: taskPrioritySchema.optional(),
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
    sortBy: z.enum(["createdAt", "updatedAt", "title", "priority", "status"]).optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
  }),
});