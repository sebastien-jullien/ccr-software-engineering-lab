import test from 'node:test';
import { applyOverlay } from '../participant/dist/config-overlay.js';
import { registerHoldoutSuite } from './holdout-suite.mjs';

registerHoldoutSuite(test, applyOverlay);
