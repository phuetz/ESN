import { Router } from 'express';
import * as contactController from '../controllers/contact.controller';
import { validateDto } from '../middleware/validation';
import { CreateContactDto, UpdateContactDto } from '../dto/contact.dto';

const router = Router();

/**
 * @swagger
 * /api/v1/contacts:
 *   get:
 *     tags: [Contacts]
 *     summary: Get all contacts
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
 *         description: List of contacts
 */
router.get('/', contactController.getContacts);

/**
 * @swagger
 * /api/v1/contacts/{id}:
 *   get:
 *     tags: [Contacts]
 *     summary: Get contact by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Contact details
 *       404:
 *         description: Contact not found
 */
router.get('/:id', contactController.getContactById);

/**
 * @swagger
 * /api/v1/contacts:
 *   post:
 *     tags: [Contacts]
 *     summary: Create a new contact
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Contact created
 */
router.post('/', validateDto(CreateContactDto), contactController.createContact);

/**
 * @swagger
 * /api/v1/contacts/{id}:
 *   put:
 *     tags: [Contacts]
 *     summary: Update contact
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Contact updated
 */
router.put('/:id', validateDto(UpdateContactDto), contactController.updateContact);

/**
 * @swagger
 * /api/v1/contacts/{id}:
 *   delete:
 *     tags: [Contacts]
 *     summary: Delete contact
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Contact deleted
 */
router.delete('/:id', contactController.deleteContact);

export default router;
