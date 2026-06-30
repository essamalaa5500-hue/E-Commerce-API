/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product Management Endpoints
 */

/**
 * @swagger
 * /product:
 *   get:
 *     summary: Get all products
 *     description: Retrieve all products with pagination and filters.
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Number of products per page
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *           example: iphone
 *         description: Search by product name
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           example: 686fe9dd71f7c437d9d1f6f2
 *         description: Category ID
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *           example: 1000
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *           example: 5000
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 */

/**
 * @swagger
 * /product/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *       404:
 *         description: Product not found
 */

/**
 * @swagger
 * /product:
 *   post:
 *     summary: Create new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - price
 *               - stock
 *               - category
 *               - images
 *             properties:
 *               name:
 *                 type: string
 *                 example: iPhone 16 Pro
 *               description:
 *                 type: string
 *                 example: Apple flagship phone
 *               price:
 *                 type: number
 *                 example: 55000
 *               stock:
 *                 type: integer
 *                 example: 20
 *               category:
 *                 type: string
 *                 example: 686fe9dd71f7c437d9d1f6f2
 *               images:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     url:
 *                       type: string
 *                       example: https://example.com/image1.jpg
 *                     publicId:
 *                       type: string
 *                       example: products/image1
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Images are required
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin only
 */

/**
 * @swagger
 * /product/{id}:
 *   patch:
 *     summary: Update product
 *     tags: [Products]
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
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               category:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     url:
 *                       type: string
 *                     publicId:
 *                       type: string
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found
 */

/**
 * @swagger
 * /product/{id}:
 *   delete:
 *     summary: Delete product
 *     tags: [Products]
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
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 */
