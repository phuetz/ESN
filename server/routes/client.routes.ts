import { Router } from 'express';
import * as clientController from '../controllers/client.controller';
import { validateDto } from '../middleware/validation';
import { CreateClientDto, UpdateClientDto } from '../dto/client.dto';
import { authenticate } from '../middleware/auth';

const router = Router();

// Apply authentication to all client routes
router.use(authenticate);

/**
 * @swagger
 * /api/v1/clients:
 *   get:
 *     tags: [Clients]
 *     summary: Get all clients
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
 *         description: List of clients
 */
router.get('/', clientController.getClients);

/**
 * @swagger
 * /api/v1/clients/{id}:
 *   get:
 *     tags: [Clients]
 *     summary: Get client by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Client details
 *       404:
 *         description: Client not found
 */
router.get('/:id', clientController.getClientById);

/**
 * @swagger
 * /api/v1/clients:
 *   post:
 *     tags: [Clients]
 *     summary: Create a new client
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Client created
 */
router.post('/', validateDto(CreateClientDto), clientController.createClient);

/**
 * @swagger
 * /api/v1/clients/{id}:
 *   put:
 *     tags: [Clients]
 *     summary: Update client
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Client updated
 */
router.put('/:id', validateDto(UpdateClientDto), clientController.updateClient);

/**
 * @swagger
 * /api/v1/clients/{id}:
 *   delete:
 *     tags: [Clients]
 *     summary: Delete client
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Client deleted
 */
router.delete('/:id', clientController.deleteClient);

export default router;
