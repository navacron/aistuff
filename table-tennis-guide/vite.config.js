import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    {
      // Serves /api/tables locally so `npm run dev` works without Vercel CLI.
      // In production, Vercel handles api/ as real serverless functions.
      name: 'local-api',
      configureServer(server) {
        server.middlewares.use('/api/tables', (req, res) => {
          if (req.method === 'OPTIONS') {
            res.writeHead(200);
            res.end();
            return;
          }
          try {
            const data = fs.readFileSync(
              path.resolve(__dirname, 'api/data/tables.json'),
              'utf-8'
            );
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(200);
            res.end(data);
          } catch (e) {
            res.writeHead(500);
            res.end(JSON.stringify({ error: 'Could not read tables.json' }));
          }
        });
      },
    },
  ],
});
