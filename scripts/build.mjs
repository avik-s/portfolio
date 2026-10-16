import { cp, mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');

const publicPaths = [
  'index.html',
  'experience',
  'projects',
  'resume',
  'contact',
  'datara',
  'prizepicker',
  'distracted-driver',
  'sorting-system',
  'assets',
  'CNAME',
];

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

await Promise.all(publicPaths.map((relativePath) => cp(
  path.join(root, relativePath),
  path.join(dist, relativePath),
  { recursive: true },
)));

console.log(`Built ${publicPaths.length} public paths into ${path.relative(root, dist)}/`);
