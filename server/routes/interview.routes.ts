import { Router } from 'express';
import * as interviewController from '../controllers/interview.controller';
import { validateDto } from '../middleware/validation';
import { CreateInterviewDto, UpdateInterviewDto } from '../dto/interview.dto';

const router = Router();

/**
 * @swagger
 * /api/v1/interviews:
 *   get:
 *     tags: [Interviews]
 *     summary: Get all interviews
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
 *         description: List of interviews
 */
router.get('/', interviewController.getInterviews);

/**
 * @swagger
 * /api/v1/interviews/{id}:
 *   get:
 *     tags: [Interviews]
 *     summary: Get interview by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Interview details
 *       404:
 *         description: Interview not found
 */
router.get('/:id', interviewController.getInterviewById);

/**
 * @swagger
 * /api/v1/interviews:
 *   post:
 *     tags: [Interviews]
 *     summary: Create a new interview
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Interview created
 */
router.post('/', validateDto(CreateInterviewDto), interviewController.createInterview);

/**
 * @swagger
 * /api/v1/interviews/{id}:
 *   put:
 *     tags: [Interviews]
 *     summary: Update interview
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Interview updated
 */
router.put('/:id', validateDto(UpdateInterviewDto), interviewController.updateInterview);

/**
 * @swagger
 * /api/v1/interviews/{id}:
 *   delete:
 *     tags: [Interviews]
 *     summary: Delete interview
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Interview deleted
 */
router.delete('/:id', interviewController.deleteInterview);

export default router;
