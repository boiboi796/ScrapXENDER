const { createServer } = require('node:http');
const { readFile } = require('node:fs/promises');
const path = require('node:path');

const frontendPath = path.join(__dirname, '..', 'frontend', 'index.html');

const server = createServer(async (request, response) => {
  if (request.method !== 'GET') {
    response.writeHead(405, { Allow: 'GET' });
    response.end('Method not allowed');
    return;
  }

  if (request.url === '/api/health') {
    response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    response.end(JSON.stringify({ status: 'ok' }));
    return;
  }

  if (request.url === '/') {
    try {
      const page = await readFile(frontendPath);
      response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      response.end(page);
    } catch {
      response.writeHead(500);
      response.end('Unable to load frontend');
    }
    return;
  }

  response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  response.end('Not found');
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`ScrapXENDER is running at http://localhost:${port}`);
});
