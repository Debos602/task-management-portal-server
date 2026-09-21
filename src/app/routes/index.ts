import express from 'express';
import { apiLimiter } from '../middlewares/rateLimiter';
import taskRoutes from '../modules/task.route';


const router = express.Router();

router.use(apiLimiter); // Apply to all routes

const moduleRoutes = [
	{ path: '/tasks', route: taskRoutes },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;