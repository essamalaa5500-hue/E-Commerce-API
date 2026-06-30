/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: Image Upload Management
 */

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Upload images (Admin)
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - images
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Images uploaded successfully
 *       400:
 *         description: Please upload at least one image
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /upload:
 *   delete:
 *     summary: Delete image from Cloudinary (Admin)
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - publicId
 *             properties:
 *               publicId:
 *                 type: string
 *                 example: ecommerce/products/abc123xyz
 *     responses:
 *       200:
 *         description: Image deleted successfully
 *       400:
 *         description: Please provide the image publicId
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Failed to delete image
 */
