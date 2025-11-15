import { Router } from 'express';
import * as quoteController from '../controllers/quote.controller';
import { validateDto } from '../middleware/validation';
import { CreateQuoteDto, UpdateQuoteDto } from '../dto/quote.dto';

const router = Router();

/**
 * @swagger
 * /api/v1/quotes:
 *   get:
 *     tags: [Quotes]
 *     summary: Get all quotes
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
 *         description: List of quotes
 */
router.get('/', quoteController.getQuotes);

/**
 * @swagger
 * /api/v1/quotes/{id}:
 *   get:
 *     tags: [Quotes]
 *     summary: Get quote by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Quote details
 *       404:
 *         description: Quote not found
 */
router.get('/:id', quoteController.getQuoteById);

/**
 * @swagger
 * /api/v1/quotes:
 *   post:
 *     tags: [Quotes]
 *     summary: Create a new quote
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Quote created
 */
router.post('/', validateDto(CreateQuoteDto), quoteController.createQuote);

/**
 * @swagger
 * /api/v1/quotes/{id}:
 *   put:
 *     tags: [Quotes]
 *     summary: Update quote
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Quote updated
 */
router.put('/:id', validateDto(UpdateQuoteDto), quoteController.updateQuote);

/**
 * @swagger
 * /api/v1/quotes/{id}:
 *   delete:
 *     tags: [Quotes]
 *     summary: Delete quote
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Quote deleted
 */
router.delete('/:id', quoteController.deleteQuote);

export default router;
