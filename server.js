/* eslint-disable no-console */
const http = require('http');
const path = require('path');

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 🔥 Shutting down...');
  console.log(err.name, err.message, err);
  process.exit(1);
});

const app = require('./app');

const port = process.env.PORT || 3000;

const server = http.createServer(app);
server.setTimeout(10 * 60 * 1000); // 10 * 60 seconds * 1000 msecs
server.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 🔥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

console.log('Main Process:', `${process.pid}`);
