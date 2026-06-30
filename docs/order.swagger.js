/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order Management APIs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     OrderProduct:
 *       type: object
 *       required:
 *         - product
 *         - quantity
 *         - price
 *       properties:
 *         product:
 *           type: string
 *           example: 6862e1b55b5a0a1234567890
 *         quantity:
 *           type: integer
 *           example: 2
 *         price:
 *           type: number
 *           example: 250
 *
 *     Order:
 *       type: object
 *       required:
 *         - user
 *         - products
 *         - totalPrice
 *       properties:
 *         _id:
 *           type: string
 *           example: 6862e1b55b5a0a1234567890
 *         user:
 *           type: string
 *           example: 6862e1b55b5a0a1234567890
 *         products:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderProduct'
 *         totalPrice:
 *           type: number
 *           example: 500
 *         paymentStatus:
 *           type: string
 *           enum:
 *             - pending
 *             - paid
 *             - failed
 *           example: pending
 *         paymobOrderId:
 *           type: string
 *           example: paymob_123456
 *         transactionId:
 *           type: string
 *           example: txn_123456
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders (Admin)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 */

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get order by ID (Admin)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order retrieved successfully
 *       404:
 *         description: Order not found
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user
 *               - products
 *               - totalPrice
 *             properties:
 *               user:
 *                 type: string
 *                 example: 6862e1b55b5a0a1234567890
 *               products:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/OrderProduct'
 *               totalPrice:
 *                 type: number
 *                 example: 500
 *     responses:
 *       201:
 *         description: Order created successfully
 */

/**
 * @swagger
 * /orders/{id}:
 *   patch:
 *     summary: Update order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paymentStatus:
 *                 type: string
 *                 enum:
 *                   - pending
 *                   - paid
 *                   - failed
 *               transactionId:
 *                 type: string
 *               paymobOrderId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Order updated successfully
 *       404:
 *         description: Order not found
 */

/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     summary: Delete order (Admin)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *       404:
 *         description: Order not found
 */
