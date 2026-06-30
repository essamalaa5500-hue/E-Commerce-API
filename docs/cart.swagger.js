/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Shopping Cart APIs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CartItem:
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
 *     Cart:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         user:
 *           type: string
 *         products:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CartItem'
 *         totalPrice:
 *           type: number
 *           example: 500
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /cart/my:
 *   get:
 *     summary: Get current user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart retrieved successfully
 *       404:
 *         description: Cart not found
 */

/**
 * @swagger
 * /cart/my/add:
 *   post:
 *     summary: Add product to cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product
 *               - quantity
 *             properties:
 *               product:
 *                 type: string
 *                 example: 6862e1b55b5a0a1234567890
 *               quantity:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Product added to cart
 */

/**
 * @swagger
 * /cart/my/update/{productId}:
 *   patch:
 *     summary: Update product quantity in cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Cart updated successfully
 *       404:
 *         description: Product not found in cart
 */

/**
 * @swagger
 * /cart/my/remove/{productId}:
 *   delete:
 *     summary: Remove product from cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product removed from cart
 *       404:
 *         description: Product not found in cart
 */

/**
 * @swagger
 * /cart/my/clear:
 *   delete:
 *     summary: Clear current user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared successfully
 *       404:
 *         description: Cart not found
 */
