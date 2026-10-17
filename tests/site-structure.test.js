import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';

const prizePickerPage = readFileSync(new URL('../prizepicker/index.html', import.meta.url), 'utf8');
const projectsPage = readFileSync(new URL('../projects/index.html', import.meta.url), 'utf8');
const homepage = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const experiencePage = readFileSync(new URL('../experience/index.html', import.meta.url), 'utf8');
const resumePage = readFileSync(new URL('../resume/index.html', import.meta.url), 'utf8');
const roboticsPage = readFileSync(new URL('../robotic-ethernet-insertion/index.html', import.meta.url), 'utf8');

describe('PrizePicker page structure', () => {
  test('exposes the simulator controls and module entrypoint', () => {
    expect(prizePickerPage).toContain('id="simulator-root"');
    expect(prizePickerPage).toContain('id="simulator-sport"');
    expect(prizePickerPage).toContain('id="simulator-style"');
    expect(prizePickerPage).toContain('id="simulator-size"');
    expect(prizePickerPage).toContain('src="../assets/js/prizepicker-simulator.js?v=20261016-six-leg"');
  });

  test('labels the simulator as educational simulated data', () => {
    expect(prizePickerPage).toMatch(/simulated sample data/i);
    expect(prizePickerPage).toMatch(/not live odds|not betting advice/i);
    expect(prizePickerPage).toMatch(/public artist names are\s+used only as fictional labels/i);
  });

  test('uses the capstone feature labels in the portfolio navigation', () => {
    expect(prizePickerPage).toContain('Simulated Odds Analyzer');
    expect(projectsPage).toContain('Interactive demo');
  });
});

describe('résumé-driven portfolio content', () => {
  test('keeps the homepage hero free of a personal headshot', () => {
    expect(homepage).not.toContain('assets/img/headshot.jpeg');
    expect(homepage).not.toContain('hero-headshot');
    expect(homepage).toContain('hero-section--solo');
  });

  test('uses the updated engineering positioning on the homepage', () => {
    expect(homepage).toContain('Building software, computer vision, and robotics systems—from scalable data pipelines to autonomous manipulation.');
  });

  test('updates DataraAI and removes the outdated Skywalkers experience', () => {
    expect(experiencePage).toContain('Software and Robotics Engineer');
    expect(experiencePage).toContain('December 2025');
    expect(experiencePage).toContain('August 2026');
    expect(experiencePage).toContain('computer-vision pipelines');
    expect(experiencePage).toContain('Azure dataset infrastructure');
    expect(experiencePage).toContain('Isaac Sim robotic');
    expect(experiencePage).not.toContain('Skywalkers');
  });

  test('adds the robotics project and removes Distracted Driver Detection', () => {
    expect(projectsPage).toContain('Vision-Guided Robotic Ethernet Insertion');
    expect(projectsPage).toContain('href="/robotic-ethernet-insertion"');
    expect(projectsPage).toContain('Isaac Sim');
    expect(projectsPage).toContain('OpenCV');
    expect(projectsPage).not.toContain('Distracted Driver Detection');
    expect(projectsPage).toContain('Automatic Sorting System');
    expect(projectsPage).not.toMatch(/Automatic Sorting System[\s\S]{0,500}2023/);
  });

  test('documents the robotics system and verified results', () => {
    expect(roboticsPage).toMatch(/system overview/i);
    expect(roboticsPage).toMatch(/stereo perception[\s\S]*port-center estimation/i);
    expect(roboticsPage).toMatch(/visual-servo[\s\S]*kinematic handoff/i);
    expect(roboticsPage).toMatch(/insertion state machine/i);
    expect(roboticsPage).toContain('48/48');
    expect(roboticsPage).toContain('9.96 mm');
    expect(roboticsPage).toContain('0.265 mm');
    expect(roboticsPage).toContain('0.028°');
    expect(roboticsPage).not.toMatch(/source code/i);
  });

  test('shows the current education facts on the résumé page', () => {
    expect(resumePage).toContain('University of Illinois Urbana-Champaign');
    expect(resumePage).toContain('B.S. Computer Engineering');
    expect(resumePage).toContain('Minor in Data Science');
    expect(resumePage).toContain('May 2029');
  });
});
