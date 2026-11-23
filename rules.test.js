import { test } from 'node:test';
import assert from 'node:assert';
import { getPreviousStatus, getNextStatus } from './rules.js';

// getNextStatusのテスト
test('todoの値を渡すと次のステータスがactiveになる', () => {
	assert.strictEqual(getNextStatus('todo'), 'active');
});

test('activeの値を渡すと次のステータスがdoneになる', () => {
	assert.strictEqual(getNextStatus('active'), 'done');
});

test('doneの値を渡すと次のステータスがnullになる', () => {
	assert.strictEqual(getNextStatus('done'), null);
});

test('不正な文字列を渡すとnullが返る', () => {
	assert.strictEqual(getNextStatus('xxx'), null);
});

test('想定外の値を渡すとnullが返る', () => {
	assert.strictEqual(getNextStatus(null), null);
});

// getPreviousStatusのテスト
test('doneの値を渡すと前のステータスがactiveになる', () => {
	assert.strictEqual(getPreviousStatus('done'), 'active');
});

test('activeの値を渡すと前のステータスがtodoになる', () => {
	assert.strictEqual(getPreviousStatus('active'), 'todo');
});

test('todoの値を渡すと前のステータスがnullになる', () => {
	assert.strictEqual(getPreviousStatus('todo'), null);
});

test('不正な文字列を渡すと前のステータスがnullになる', () => {
	assert.strictEqual(getPreviousStatus('xxx'), null);
});

test('想定外の値を渡すと前のステータスがnullになる', () => {
	assert.strictEqual(getPreviousStatus(null), null);
});
