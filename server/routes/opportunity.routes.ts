import { Router } from 'express';
import * as opportunityController from '../controllers/opportunity.controller';
import { validateDto } from '../middleware/validation';
import { CreateOpportunityDto, UpdateOpportunityDto } from '../dto/opportunity.dto';

const router = Router();

/**
 * @swagger
 * /api/v1/opportunities:
 *   get:
 *     tags: [Opportunities]
 *     summary: Get all opportunities
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
 *         description: List of opportunities
 */
router.get('/', opportunityController.getOpportunities);

/**
 * @swagger
 * /api/v1/opportunities/stats/pipeline:
 *   get:
 *     tags: [Opportunities]
 *     summary: Get pipeline statistics
 *     responses:
 *       200:
 *         description: Pipeline statistics
 */
router.get('/stats/pipeline', opportunityController.getPipelineStats);

/**
 * @swagger
 * /api/v1/opportunities/{id}:
 *   get:
 *     tags: [Opportunities]
 *     summary: Get opportunity by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Opportunity details
 *       404:
 *         description: Opportunity not found
 */
router.get('/:id', opportunityController.getOpportunityById);

/**
 * @swagger
 * /api/v1/opportunities:
 *   post:
 *     tags: [Opportunities]
 *     summary: Create a new opportunity
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Opportunity created
 */
router.post('/', validateDto(CreateOpportunityDto), opportunityController.createOpportunity);

/**
 * @swagger
 * /api/v1/opportunities/{id}:
 *   put:
 *     tags: [Opportunities]
 *     summary: Update opportunity
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Opportunity updated
 */
router.put('/:id', validateDto(UpdateOpportunityDto), opportunityController.updateOpportunity);

/**
 * @swagger
 * /api/v1/opportunities/{id}:
 *   delete:
 *     tags: [Opportunities]
 *     summary: Delete opportunity
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Opportunity deleted
 */
router.delete('/:id', opportunityController.deleteOpportunity);

export default router;
