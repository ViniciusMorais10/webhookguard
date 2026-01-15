import http from 'http';

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/mock') {
    let body = '';

    req.on('data', (chunk) => (body += chunk));

    req.on('end', () => {
      console.log('Mock Received: ', body);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok' }));
    });
    return;
  }

  res.writeHead(404);
  res.end();
});

server.listen(4000, () =>
  console.log('Mock receiver listening on http://localhost:4000/mock'),
);
