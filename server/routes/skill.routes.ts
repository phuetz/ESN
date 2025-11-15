import { Router } from 'express';
import * as skillController from '../controllers/skill.controller';
import { validateDto } from '../middleware/validation';
import { CreateSkillDto, UpdateSkillDto } from '../dto/skill.dto';

const router = Router();

/**
 * @swagger
 * /api/v1/skills:
 *   get:
 *     tags: [Skills]
 *     summary: Get all skills
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
 *         description: List of skills
 */
router.get('/', skillController.getSkills);

/**
 * @swagger
 * /api/v1/skills/{id}:
 *   get:
 *     tags: [Skills]
 *     summary: Get skill by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Skill details
 *       404:
 *         description: Skill not found
 */
router.get('/:id', skillController.getSkillById);

/**
 * @swagger
 * /api/v1/skills:
 *   post:
 *     tags: [Skills]
 *     summary: Create a new skill
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Skill created
 */
router.post('/', validateDto(CreateSkillDto), skillController.createSkill);

/**
 * @swagger
 * /api/v1/skills/{id}:
 *   put:
 *     tags: [Skills]
 *     summary: Update skill
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Skill updated
 */
router.put('/:id', validateDto(UpdateSkillDto), skillController.updateSkill);

/**
 * @swagger
 * /api/v1/skills/{id}:
 *   delete:
 *     tags: [Skills]
 *     summary: Delete skill
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Skill deleted
 */
router.delete('/:id', skillController.deleteSkill);

export default router;
