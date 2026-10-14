import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.resolve(__dirname, '../dist');
const indexHtmlPath = path.join(distDir, 'index.html');

if (fs.existsSync(indexHtmlPath)) {
  const indexHtml = fs.readFileSync(indexHtmlPath, 'utf-8');

  // Ensure _redirects file for Render / Netlify
  fs.writeFileSync(path.join(distDir, '_redirects'), '/*    /index.html   200\n', 'utf-8');

  // Ensure 404.html fallback
  fs.writeFileSync(path.join(distDir, '404.html'), indexHtml, 'utf-8');

  // Pre-generate route folders with index.html for static hosting servers
  const routes = [
    'india-map',
    'map',
    'graph',
    'solve',
    'ask',
    'scan',
    'flashcards',
    'voice-learning',
    'news',
    'current-affairs',
    'history',
    'profile',
    'planner',
    'study-planner',
    'settings',
    'login',
    'admin-login',
    'admin',
  ];

  for (const route of routes) {
    const routeDir = path.join(distDir, route);
    if (!fs.existsSync(routeDir)) {
      fs.mkdirSync(routeDir, { recursive: true });
    }
    fs.writeFileSync(path.join(routeDir, 'index.html'), indexHtml, 'utf-8');
  }

  console.log(`[Postbuild] Successfully created _redirects, 404.html, and ${routes.length} SPA route directories.`);
} else {
  console.warn('[Postbuild] index.html not found in dist, skipping route generation.');
}
