import { Router } from 'express';
import * as projectController from '../controllers/project.controller';
import { validateDto } from '../middleware/validation';
import { CreateProjectDto, UpdateProjectDto } from '../dto/project.dto';

const router = Router();

/**
 * @swagger
 * /api/v1/projects:
 *   get:
 *     tags: [Projects]
 *     summary: Get all projects
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: clientId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: consultantId
 *         schema:
 *           type: integer
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
 *         description: List of projects
 */
router.get('/', projectController.getProjects);

/**
 * @swagger
 * /api/v1/projects/{id}:
 *   get:
 *     tags: [Projects]
 *     summary: Get project by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Project details
 *       404:
 *         description: Project not found
 */
router.get('/:id', projectController.getProjectById);

/**
 * @swagger
 * /api/v1/projects:
 *   post:
 *     tags: [Projects]
 *     summary: Create a new project
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Project created
 */
router.post('/', validateDto(CreateProjectDto), projectController.createProject);

/**
 * @swagger
 * /api/v1/projects/{id}:
 *   put:
 *     tags: [Projects]
 *     summary: Update project
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Project updated
 */
router.put('/:id', validateDto(UpdateProjectDto), projectController.updateProject);

/**
 * @swagger
 * /api/v1/projects/{id}:
 *   delete:
 *     tags: [Projects]
 *     summary: Delete project
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Project deleted
 */
router.delete('/:id', projectController.deleteProject);

export default router;
