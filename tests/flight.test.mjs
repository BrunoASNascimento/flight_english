import assert from 'node:assert/strict';
import {test} from 'node:test';
import {crossedAltitudes} from '../game/flight.ts';
test('announces all requested thresholds in descent order',()=>assert.deepEqual(crossedAltitudes(1100,150),[1000,500,400,300,200]));
test('does not repeat at the same threshold',()=>assert.deepEqual(crossedAltitudes(500,499),[]));
test('does not announce during climb',()=>assert.deepEqual(crossedAltitudes(150,1100),[]));
test('announces again on a new descent',()=>assert.deepEqual(crossedAltitudes(600,450),[500]));
