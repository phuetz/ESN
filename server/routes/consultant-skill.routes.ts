import { Router } from 'express';
import * as consultantSkillController from '../controllers/consultant-skill.controller';
import { validateDto } from '../middleware/validation';
import { CreateConsultantSkillDto, UpdateConsultantSkillDto } from '../dto/consultant-skill.dto';

const router = Router();

/**
 * @swagger
 * /api/v1/consultant-skills:
 *   get:
 *     tags: [Consultant Skills]
 *     summary: Get all consultant skills
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
 *         description: List of consultant skills
 */
router.get('/', consultantSkillController.getConsultantSkills);

/**
 * @swagger
 * /api/v1/consultant-skills/{id}:
 *   get:
 *     tags: [Consultant Skills]
 *     summary: Get consultant skill by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Consultant skill details
 *       404:
 *         description: Consultant skill not found
 */
router.get('/:id', consultantSkillController.getConsultantSkillById);

/**
 * @swagger
 * /api/v1/consultant-skills:
 *   post:
 *     tags: [Consultant Skills]
 *     summary: Create a new consultant skill
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Consultant skill created
 */
router.post('/', validateDto(CreateConsultantSkillDto), consultantSkillController.createConsultantSkill);

/**
 * @swagger
 * /api/v1/consultant-skills/{id}:
 *   put:
 *     tags: [Consultant Skills]
 *     summary: Update consultant skill
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Consultant skill updated
 */
router.put('/:id', validateDto(UpdateConsultantSkillDto), consultantSkillController.updateConsultantSkill);

/**
 * @swagger
 * /api/v1/consultant-skills/{id}:
 *   delete:
 *     tags: [Consultant Skills]
 *     summary: Delete consultant skill
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Consultant skill deleted
 */
router.delete('/:id', consultantSkillController.deleteConsultantSkill);

export default router;
