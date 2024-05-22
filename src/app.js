// Modules
const express = require('express');

// Utils
const { swaggerUi, specs } = require("./config/swagger/index");
const {logger,stream} = require('./utils/logger');

// DB

// Middlewares
require('dotenv').config();
const morganMiddleware = require('./middleware/morganMiddleware');

const app = express();

/**
 * @swagger
 * /:
 *   get:
 *     summary: Hello Express
 *     description: GET 요청을 통해 "Hello, Express!" 메시지를 반환합니다.
 *     responses:
 *       200:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: "Hello, Express!"
 */
app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use(express.json());
app.use(morganMiddleware);

app.use((err, req, res, next) => {
  logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  res.status(500).send('Something broke!');
});
app.listen(process.env.PORT, () => {
  logger.info('Server is running on port 8080');
});
