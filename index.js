const express = require("express");
const cors = require("cors");
const proxy = require("express-http-proxy");

const dotenv = require("dotenv");
const {authenticateToken} = require("./middleware/auth_token");
const app = express();

app.use(cors());
app.use(express.json());

// const validateJwt = (req, res, next) => {
//   const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

//   if (!token) {
//     return res.status(401).json({ message: 'Unauthorized' });
//   }
//   const publicKey = "";
//   jwt.verify(token, publicKey, (err, decoded) => {
//   if (err) {
//     return res.status(401).json({ message: 'Invalid token' });
//   }
//     req.user = decoded;
//     next();
//   });
// };

// // Apply JWT validation middleware for all routes under /passport and /visa
app.use("/passport", authenticateToken);
app.use("/visa", authenticateToken);

app.use("/auth", proxy("http://localhost:8001"));
app.use("/passport", authenticateToken,proxy("http://localhost:8002"));
app.use("/visa", proxy("http://localhost:8003"));
app.use("/payment", proxy("http://localhost:8004"));
// app.use("/notification", proxy("http://localhost:8005"));

const server = app.listen(8000, () => {
  console.log("Gateway is Listening to Port 8000");
});

server.timeout = 120000; 



  // Create a channel for RabbitMQ
async function createRabbitMQChannel() {
  try {
    // Connect to RabbitMQ
    const connection = await amqplib.connect('amqps://gimfhrot:2_arW8NuU7M8oXR1LsfWqBYBnrNid4Bi@toad.rmq.cloudamqp.com/gimfhrot');
    const channel = await connection.createChannel();

    // Assert the queue with the correct options
    await channel.assertQueue('VISA', { durable: true });

    return channel;
  } catch (err) {
    throw err;
  }
}
