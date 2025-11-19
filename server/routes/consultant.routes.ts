import { Router } from 'express';
import * as consultantController from '../controllers/consultant.controller';
import { validateDto } from '../middleware/validation';
import { CreateConsultantDto, UpdateConsultantDto } from '../dto/consultant.dto';
import { authenticate } from '../middleware/auth';

const router = Router();

// Apply authentication to all consultant routes
router.use(authenticate);

/**
 * @swagger
 * /api/v1/consultants:
 *   get:
 *     tags: [Consultants]
 *     summary: Get all consultants
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
 *         description: List of consultants
 */
router.get('/', consultantController.getConsultants);

/**
 * @swagger
 * /api/v1/consultants/{id}:
 *   get:
 *     tags: [Consultants]
 *     summary: Get consultant by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Consultant details
 *       404:
 *         description: Consultant not found
 */
router.get('/:id', consultantController.getConsultantById);

/**
 * @swagger
 * /api/v1/consultants:
 *   post:
 *     tags: [Consultants]
 *     summary: Create a new consultant
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Consultant created
 */
router.post('/', validateDto(CreateConsultantDto), consultantController.createConsultant);

/**
 * @swagger
 * /api/v1/consultants/{id}:
 *   put:
 *     tags: [Consultants]
 *     summary: Update consultant
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Consultant updated
 */
router.put('/:id', validateDto(UpdateConsultantDto), consultantController.updateConsultant);

/**
 * @swagger
 * /api/v1/consultants/{id}:
 *   delete:
 *     tags: [Consultants]
 *     summary: Delete consultant
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Consultant deleted
 */
router.delete('/:id', consultantController.deleteConsultant);

export default router;
