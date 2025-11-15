import { Router } from 'express';
import * as missionController from '../controllers/mission.controller';
import { validateDto } from '../middleware/validation';
import { CreateMissionDto, UpdateMissionDto } from '../dto/mission.dto';

const router = Router();

/**
 * @swagger
 * /api/v1/missions:
 *   get:
 *     tags: [Missions]
 *     summary: Get all missions
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
 *         description: List of missions
 */
router.get('/', missionController.getMissions);

/**
 * @swagger
 * /api/v1/missions/ending-soon:
 *   get:
 *     tags: [Missions]
 *     summary: Get missions ending soon
 *     responses:
 *       200:
 *         description: List of missions ending soon
 */
router.get('/ending-soon', missionController.getEndingSoonMissions);

/**
 * @swagger
 * /api/v1/missions/{id}:
 *   get:
 *     tags: [Missions]
 *     summary: Get mission by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Mission details
 *       404:
 *         description: Mission not found
 */
router.get('/:id', missionController.getMissionById);

/**
 * @swagger
 * /api/v1/missions:
 *   post:
 *     tags: [Missions]
 *     summary: Create a new mission
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Mission created
 */
router.post('/', validateDto(CreateMissionDto), missionController.createMission);

/**
 * @swagger
 * /api/v1/missions/{id}:
 *   put:
 *     tags: [Missions]
 *     summary: Update mission
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Mission updated
 */
router.put('/:id', validateDto(UpdateMissionDto), missionController.updateMission);

/**
 * @swagger
 * /api/v1/missions/{id}:
 *   delete:
 *     tags: [Missions]
 *     summary: Delete mission
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Mission deleted
 */
router.delete('/:id', missionController.deleteMission);

export default router;
