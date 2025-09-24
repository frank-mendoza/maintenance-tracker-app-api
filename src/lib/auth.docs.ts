/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               lastName:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad request
 *
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               isLogin:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Unauthorized
 * /auth/logout:
 *   get:
 *     summary: Login user
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Unauthorized
 
 * /auth/verify-email:
 *   get:
 *     summary: Verify user email
 *     description: Verifies a user's email using a verification token sent to their email.
 *     tags:
 *       - Auth
 *     parameters:
 *       - in: query
 *         name: verificationToken
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT token received via email for verification
 *     responses:
 *       200:
 *         description: Email verification successful
 *       400:
 *         description: Email already verified
 *       401:
 *         description: Invalid or expired token
 *
 * /auth/verify-setup-token:
 *   get:
 *     summary: Verify user setup token
 *     description: Verifies a manually created user account setup token.
 *     tags:
 *       - Auth
 *     parameters:
 *       - in: query
 *         name: setup_account_token
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT token for verifying account setup
 *     responses:
 *       200:
 *         description: Setup token verified successfully
 *       202:
 *         description: Account is already set up
 *       401:
 *         description: Invalid or expired setup token
 *
 * /auth/send-verification-token:
 *   post:
 *     summary: Send verification token
 *     description: Sends a verification token to the user's email.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - userEmail
 *             properties:
 *               userId:
 *                 type: string
 *               userEmail:
 *                 type: string
 *     responses:
 *       200:
 *         description: Verification token sent successfully
 *       400:
 *         description: Failed to send verification token
 *
 * /auth/setup-user:
 *   post:
 *     summary: Complete new user setup
 *     description: Finalizes the setup for a manually created user and sends an email verification token.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - password
 *             properties:
 *               id:
 *                 type: string
 *                 description: User ID
 *               password:
 *                 type: string
 *                 description: New password for the user
 *               email:
 *                 type: string
 *                 description: User email (used for sending verification token)
 *               name:
 *                 type: string
 *               lastName:
 *                 type: string
 *     responses:
 *       201:
 *         description: Successfully setup user
 *       400:
 *         description: User setup error
 *       404:
 *         description: User not found
 */
