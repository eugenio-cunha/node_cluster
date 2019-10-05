const http = require('http');
const cluster = require('cluster');
const cpus = require('os').cpus().length;

const port = 3000;

if (cluster.isMaster) {
  console.log('Master process is running');

  for (let i = 0; i < cpus; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died with code: ${code}, and signal: ${signal}`);
    console.log('Starting a new worker');

    cluster.fork();
  });
  
} else {
  http.createServer((_req, res) => {
    res.writeHead(200);
    res.end(`Hello - I am the worker ${cluster.worker.id}\n`);
  }).listen(port);

  console.log(`Listening on port ${port}`);
}