import test from 'node:test';
import { referenceApplyOverlay } from './reference-engine.mjs';
import { registerHoldoutSuite } from './holdout-suite.mjs';

registerHoldoutSuite(test, referenceApplyOverlay);
