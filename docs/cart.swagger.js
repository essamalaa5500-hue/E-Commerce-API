/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Shopping Cart Management Endpoints
 */

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get all carts
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All carts retrieved successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /cart/{id}:
 *   get:
 *     summary: Get cart by ID
 *     tags: [Cart]
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
 *         description: Cart retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Cart not found
 */

/**
 * @swagger
 * /cart:
 *   post:
 *     summary: Create a new cart
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
 *               - user
 *               - products
 *               - totalPrice
 *             properties:
 *               user:
 *                 type: string
 *                 example: 686fe9dd71f7c437d9d1f6f2
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - product
 *                     - quantity
 *                     - price
 *                   properties:
 *                     product:
 *                       type: string
 *                       example: 686fe9dd71f7c437d9d1f700
 *                     quantity:
 *                       type: integer
 *                       example: 2
 *                     price:
 *                       type: number
 *                       example: 1500
 *               totalPrice:
 *                 type: number
 *                 example: 3000
 *     responses:
 *       201:
 *         description: Cart created successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /cart/{id}:
 *   patch:
 *     summary: Update cart
 *     tags: [Cart]
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
 *               user:
 *                 type: string
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *                     price:
 *                       type: number
 *               totalPrice:
 *                 type: number
 *     responses:
 *       200:
 *         description: Cart updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Cart not found
 */

/**
 * @swagger
 * /cart/{id}:
 *   delete:
 *     summary: Delete cart
 *     tags: [Cart]
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
 *         description: Cart deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Cart not found
 */
