const express = require('express');
const { createRequestHandler } = require('@remix-run/express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable('x-powered-by');

// Serve static files from the public directory
app.use(express.static('public'));

// Everything else is handled by Remix
app.all(
  '*',
  createRequestHandler({
    build: path.join(process.cwd(), 'build'),
  })
);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});