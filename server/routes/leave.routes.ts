import { Router } from 'express';
import * as leaveController from '../controllers/leave.controller';
import { validateDto } from '../middleware/validation';
import { CreateLeaveDto, UpdateLeaveDto } from '../dto/leave.dto';

const router = Router();

/**
 * @swagger
 * /api/v1/leaves:
 *   get:
 *     tags: [Leaves]
 *     summary: Get all leaves
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
 *         description: List of leaves
 */
router.get('/', leaveController.getLeaves);

/**
 * @swagger
 * /api/v1/leaves/{id}:
 *   get:
 *     tags: [Leaves]
 *     summary: Get leave by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Leave details
 *       404:
 *         description: Leave not found
 */
router.get('/:id', leaveController.getLeaveById);

/**
 * @swagger
 * /api/v1/leaves:
 *   post:
 *     tags: [Leaves]
 *     summary: Create a new leave
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Leave created
 */
router.post('/', validateDto(CreateLeaveDto), leaveController.createLeave);

/**
 * @swagger
 * /api/v1/leaves/{id}:
 *   put:
 *     tags: [Leaves]
 *     summary: Update leave
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Leave updated
 */
router.put('/:id', validateDto(UpdateLeaveDto), leaveController.updateLeave);

/**
 * @swagger
 * /api/v1/leaves/{id}:
 *   delete:
 *     tags: [Leaves]
 *     summary: Delete leave
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Leave deleted
 */
router.delete('/:id', leaveController.deleteLeave);

/**
 * @swagger
 * /api/v1/leaves/{id}/approve:
 *   post:
 *     tags: [Leaves]
 *     summary: Approve leave
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Leave approved
 */
router.post('/:id/approve', leaveController.approveLeave);

/**
 * @swagger
 * /api/v1/leaves/{id}/reject:
 *   post:
 *     tags: [Leaves]
 *     summary: Reject leave
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Leave rejected
 */
router.post('/:id/reject', leaveController.rejectLeave);

export default router;
