import express from 'express';
import { createRequestHandler } from '@remix-run/express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.disable('x-powered-by');

app.use(express.static('public'));

app.all(
  '*',
  createRequestHandler({
    build: path.join(process.cwd(), 'build'),
  })
);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});