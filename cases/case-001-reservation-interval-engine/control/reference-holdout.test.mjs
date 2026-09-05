import test from 'node:test';
import { ReferenceReservationEngine } from './reference-engine.mjs';
import { registerHoldoutSuite } from './holdout-suite.mjs';

registerHoldoutSuite(test, ReferenceReservationEngine);
