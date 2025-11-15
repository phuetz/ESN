import { Router } from 'express';
import * as expenseController from '../controllers/expense.controller';
import { validateDto } from '../middleware/validation';
import { CreateExpenseDto, UpdateExpenseDto } from '../dto/expense.dto';

const router = Router();

/**
 * @swagger
 * /api/v1/expenses:
 *   get:
 *     tags: [Expenses]
 *     summary: Get all expenses
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
 *         description: List of expenses
 */
router.get('/', expenseController.getExpenses);

/**
 * @swagger
 * /api/v1/expenses/{id}:
 *   get:
 *     tags: [Expenses]
 *     summary: Get expense by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Expense details
 *       404:
 *         description: Expense not found
 */
router.get('/:id', expenseController.getExpenseById);

/**
 * @swagger
 * /api/v1/expenses:
 *   post:
 *     tags: [Expenses]
 *     summary: Create a new expense
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Expense created
 */
router.post('/', validateDto(CreateExpenseDto), expenseController.createExpense);

/**
 * @swagger
 * /api/v1/expenses/{id}:
 *   put:
 *     tags: [Expenses]
 *     summary: Update expense
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Expense updated
 */
router.put('/:id', validateDto(UpdateExpenseDto), expenseController.updateExpense);

/**
 * @swagger
 * /api/v1/expenses/{id}:
 *   delete:
 *     tags: [Expenses]
 *     summary: Delete expense
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Expense deleted
 */
router.delete('/:id', expenseController.deleteExpense);

/**
 * @swagger
 * /api/v1/expenses/{id}/approve:
 *   post:
 *     tags: [Expenses]
 *     summary: Approve expense
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Expense approved
 */
router.post('/:id/approve', expenseController.approveExpense);

/**
 * @swagger
 * /api/v1/expenses/{id}/reject:
 *   post:
 *     tags: [Expenses]
 *     summary: Reject expense
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Expense rejected
 */
router.post('/:id/reject', expenseController.rejectExpense);

export default router;
