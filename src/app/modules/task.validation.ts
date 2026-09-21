// task.validation.ts
import { z } from "zod";

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    priority: z.enum(["Low", "Medium", "High"]).default("Medium"),
    status: z.enum(["Pending", "In Progress", "Completed"]).default("Pending"),
  }),
});

export const updateTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    priority: z.enum(["Low", "Medium", "High"]).optional(),
    status: z.enum(["Pending", "In Progress", "Completed"]).optional(),
  }),
});