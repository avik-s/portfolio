import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';

describe('static site build', () => {
  test('copies every public route and preserves the custom domain', () => {
    execFileSync('node', ['scripts/build.mjs'], { stdio: 'pipe' });

    [
      'index.html',
      'experience/index.html',
      'projects/index.html',
      'prizepicker/index.html',
      'contact/index.html',
      'resume/index.html',
      'datara/index.html',
      'distracted-driver/index.html',
      'sorting-system/index.html',
      'assets/css/styles.css',
      'assets/js/script.js',
      'CNAME',
    ].forEach((route) => {
      expect(existsSync(`dist/${route}`), route).toBe(true);
    });

    expect(readFileSync('dist/CNAME', 'utf8').trim()).toBe('aviksolanki.com');
  });
});
