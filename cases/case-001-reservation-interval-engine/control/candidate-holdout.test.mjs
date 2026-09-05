import test from 'node:test';
import { ReservationEngine } from '../participant/dist/reservation-engine.js';
import { registerHoldoutSuite } from './holdout-suite.mjs';

registerHoldoutSuite(test, ReservationEngine);
