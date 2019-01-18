import test from 'ava';
import { toWib, fromWib } from '../../../src/utils/wibson-lib/coin';

test('toWib returns the correct amount of wibcoins', (assert) => {
  assert.is(toWib('0'), '0');
  assert.is(toWib('0'), '0');
  assert.is(toWib('1', { decimals: 9 }), '0.000000001');
  assert.is(toWib('1000000000'), '1');
  assert.is(toWib('9000000000000000000'), '9,000,000,000');
});

test('toWib returns the correct amount of wibcoins when exponential notation is used', (assert) => {
  assert.is(toWib('1e+9'), '1');
  assert.is(toWib('9e+18'), '9,000,000,000');
});

test('toWib throws an Error when an invalid number is specified', (assert) => {
  assert.throws(() => toWib('10WIB'), 'Argument is not a number');
  assert.throws(() => toWib('10 WIB'), 'Argument is not a number');
  assert.throws(() => toWib(''), 'Argument is not a number');
  assert.throws(() => toWib(NaN), 'Argument is not a number');
  assert.throws(() => toWib(undefined), 'Argument is not a number');
  assert.throws(() => toWib(null), 'Argument is not a number');
});

test('toWib throws an Error when number is out of range', (assert) => {
  assert.throws(() => toWib('1e+19'), 'Argument out of range');
});

test('fromWib returns the correct big number representation', (assert) => {
  assert.is(fromWib('0'), '0');
  assert.is(fromWib('0.000000001'), '1');
  assert.is(fromWib('1'), '1000000000');
  assert.is(fromWib('9000000000'), '9000000000000000000');
});

test('fromWib returns the correct big number representation amount of wibcoins when exponential notation is used', (assert) => {
  assert.is(fromWib('1e+1'), '10000000000');
  assert.is(fromWib('9e+9'), '9000000000000000000');
});

test('fromWib throws an Error when an invalid number is specified', (assert) => {
  assert.throws(() => fromWib('10WIB'), 'Argument is not a number');
  assert.throws(() => fromWib('10 WIB'), 'Argument is not a number');
  assert.throws(() => fromWib(''), 'Argument is not a number');
  assert.throws(() => fromWib(NaN), 'Argument is not a number');
  assert.throws(() => fromWib(undefined), 'Argument is not a number');
  assert.throws(() => fromWib(null), 'Argument is not a number');
});

test('fromWib throws an Error when number is out of range', (assert) => {
  assert.throws(() => fromWib('1e+10'), 'Argument out of range');
});
