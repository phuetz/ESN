import { Router } from 'express';
import * as activityController from '../controllers/activity.controller';
import { validateDto } from '../middleware/validation';
import { CreateActivityDto, UpdateActivityDto } from '../dto/activity.dto';

const router = Router();

/**
 * @swagger
 * /api/v1/activities:
 *   get:
 *     tags: [Activities]
 *     summary: Get all activities
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of activities
 */
router.get('/', activityController.getActivities);

/**
 * @swagger
 * /api/v1/activities/{id}:
 *   get:
 *     tags: [Activities]
 *     summary: Get activity by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Activity details
 *       404:
 *         description: Activity not found
 */
router.get('/:id', activityController.getActivityById);

/**
 * @swagger
 * /api/v1/activities:
 *   post:
 *     tags: [Activities]
 *     summary: Create a new activity
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Activity created
 */
router.post('/', validateDto(CreateActivityDto), activityController.createActivity);

/**
 * @swagger
 * /api/v1/activities/{id}:
 *   put:
 *     tags: [Activities]
 *     summary: Update activity
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Activity updated
 */
router.put('/:id', validateDto(UpdateActivityDto), activityController.updateActivity);

/**
 * @swagger
 * /api/v1/activities/{id}:
 *   delete:
 *     tags: [Activities]
 *     summary: Delete activity
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Activity deleted
 */
router.delete('/:id', activityController.deleteActivity);

export default router;
