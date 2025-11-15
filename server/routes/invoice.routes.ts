import { Router } from 'express';
import * as invoiceController from '../controllers/invoice.controller';
import { validateDto } from '../middleware/validation';
import { CreateInvoiceDto, UpdateInvoiceDto } from '../dto/invoice.dto';

const router = Router();

/**
 * @swagger
 * /api/v1/invoices:
 *   get:
 *     tags: [Invoices]
 *     summary: Get all invoices
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
 *         description: List of invoices
 */
router.get('/', invoiceController.getInvoices);

/**
 * @swagger
 * /api/v1/invoices/stats:
 *   get:
 *     tags: [Invoices]
 *     summary: Get invoice statistics
 *     responses:
 *       200:
 *         description: Invoice statistics
 */
router.get('/stats', invoiceController.getInvoiceStats);

/**
 * @swagger
 * /api/v1/invoices/{id}:
 *   get:
 *     tags: [Invoices]
 *     summary: Get invoice by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Invoice details
 *       404:
 *         description: Invoice not found
 */
router.get('/:id', invoiceController.getInvoiceById);

/**
 * @swagger
 * /api/v1/invoices:
 *   post:
 *     tags: [Invoices]
 *     summary: Create a new invoice
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Invoice created
 */
router.post('/', validateDto(CreateInvoiceDto), invoiceController.createInvoice);

/**
 * @swagger
 * /api/v1/invoices/{id}:
 *   put:
 *     tags: [Invoices]
 *     summary: Update invoice
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Invoice updated
 */
router.put('/:id', validateDto(UpdateInvoiceDto), invoiceController.updateInvoice);

/**
 * @swagger
 * /api/v1/invoices/{id}:
 *   delete:
 *     tags: [Invoices]
 *     summary: Delete invoice
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Invoice deleted
 */
router.delete('/:id', invoiceController.deleteInvoice);

export default router;
