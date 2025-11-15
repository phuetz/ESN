import { Router } from 'express';
import * as timesheetController from '../controllers/timesheet.controller';
import { validateDto } from '../middleware/validation';
import { CreateTimesheetDto, UpdateTimesheetDto } from '../dto/timesheet.dto';

const router = Router();

/**
 * @swagger
 * /api/v1/timesheets:
 *   get:
 *     tags: [Timesheets]
 *     summary: Get all timesheets
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
 *         description: List of timesheets
 */
router.get('/', timesheetController.getTimesheets);

/**
 * @swagger
 * /api/v1/timesheets/stats:
 *   get:
 *     tags: [Timesheets]
 *     summary: Get timesheet statistics
 *     responses:
 *       200:
 *         description: Timesheet statistics
 */
router.get('/stats', timesheetController.getTimesheetStats);

/**
 * @swagger
 * /api/v1/timesheets/{id}:
 *   get:
 *     tags: [Timesheets]
 *     summary: Get timesheet by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Timesheet details
 *       404:
 *         description: Timesheet not found
 */
router.get('/:id', timesheetController.getTimesheetById);

/**
 * @swagger
 * /api/v1/timesheets:
 *   post:
 *     tags: [Timesheets]
 *     summary: Create a new timesheet
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Timesheet created
 */
router.post('/', validateDto(CreateTimesheetDto), timesheetController.createTimesheet);

/**
 * @swagger
 * /api/v1/timesheets/{id}:
 *   put:
 *     tags: [Timesheets]
 *     summary: Update timesheet
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Timesheet updated
 */
router.put('/:id', validateDto(UpdateTimesheetDto), timesheetController.updateTimesheet);

/**
 * @swagger
 * /api/v1/timesheets/{id}:
 *   delete:
 *     tags: [Timesheets]
 *     summary: Delete timesheet
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Timesheet deleted
 */
router.delete('/:id', timesheetController.deleteTimesheet);

/**
 * @swagger
 * /api/v1/timesheets/{id}/approve:
 *   post:
 *     tags: [Timesheets]
 *     summary: Approve timesheet
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Timesheet approved
 */
router.post('/:id/approve', timesheetController.approveTimesheet);

/**
 * @swagger
 * /api/v1/timesheets/{id}/reject:
 *   post:
 *     tags: [Timesheets]
 *     summary: Reject timesheet
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Timesheet rejected
 */
router.post('/:id/reject', timesheetController.rejectTimesheet);

export default router;
