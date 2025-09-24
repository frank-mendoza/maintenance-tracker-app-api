/**
 * @openapi
 * /maintenance:
 *   post:
 *     summary: Create a new maintenance ticket
 *     description: Tenants can report a maintenance issue and assign it to a technician.
 *     tags:
 *       - Maintenance
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - reportedBy
 *               - assignedTo
 *               - propertyId
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               reportedBy:
 *                 type: string
 *                 description: User ID of the tenant
 *               assignedTo:
 *                 type: string
 *                 description: User ID of the technician
 *               propertyId:
 *                 type: string
 *                 description: Property ID
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Ticket created successfully
 *       400:
 *         description: Failed to create ticket
 *       401:
 *         description: Unauthorized
 *
 *   get:
 *     summary: Get all maintenance logs
 *     description: Fetch paginated maintenance logs with optional filters and sorting.
 *     tags:
 *       - Maintenance
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [newest, oldest, a-z, z-a]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of maintenance logs
 *
 * /maintenance/{id}:
 *   get:
 *     summary: Get maintenance log details
 *     tags:
 *       - Maintenance
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Maintenance log ID
 *     responses:
 *       200:
 *         description: Returns maintenance log details
 *       404:
 *         description: Ticket not found
 *
 *   patch:
 *     summary: Update a maintenance log
 *     tags:
 *       - Maintenance
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Ticket updated successfully
 *       400:
 *         description: Failed to update ticket
 *       404:
 *         description: Ticket not found
 *
 * /maintenance/{id}/status:
 *   patch:
 *     summary: Update the status of a maintenance ticket
 *     tags:
 *       - Maintenance
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Maintenance log ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, in_progress, completed, cancelled]
 *               comments:
 *                 type: string
 *               userId:
 *                 type: string
 *                 description: ID of the technician completing the ticket
 *     responses:
 *       200:
 *         description: Ticket status updated successfully
 *       400:
 *         description: Invalid status change
 *       404:
 *         description: Ticket not found
 */
