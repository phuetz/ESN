import { Router } from 'express';
import * as candidateController from '../controllers/candidate.controller';
import { validateDto } from '../middleware/validation';
import { CreateCandidateDto, UpdateCandidateDto } from '../dto/candidate.dto';

const router = Router();

/**
 * @swagger
 * /api/v1/candidates:
 *   get:
 *     tags: [Candidates]
 *     summary: Get all candidates
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
 *         description: List of candidates
 */
router.get('/', candidateController.getCandidates);

/**
 * @swagger
 * /api/v1/candidates/{id}:
 *   get:
 *     tags: [Candidates]
 *     summary: Get candidate by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Candidate details
 *       404:
 *         description: Candidate not found
 */
router.get('/:id', candidateController.getCandidateById);

/**
 * @swagger
 * /api/v1/candidates:
 *   post:
 *     tags: [Candidates]
 *     summary: Create a new candidate
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Candidate created
 */
router.post('/', validateDto(CreateCandidateDto), candidateController.createCandidate);

/**
 * @swagger
 * /api/v1/candidates/{id}:
 *   put:
 *     tags: [Candidates]
 *     summary: Update candidate
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Candidate updated
 */
router.put('/:id', validateDto(UpdateCandidateDto), candidateController.updateCandidate);

/**
 * @swagger
 * /api/v1/candidates/{id}:
 *   delete:
 *     tags: [Candidates]
 *     summary: Delete candidate
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Candidate deleted
 */
router.delete('/:id', candidateController.deleteCandidate);

export default router;
