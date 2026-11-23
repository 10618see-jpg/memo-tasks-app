import { test } from 'node:test';
import assert from 'node:assert';
import { getPreviousStatus, getNextStatus, isValidTask, isValidMemo } from './rules.js';

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

// isValidTaskのテスト
const taskCases = [
	{
		name: '正しいタスクはtrueになる',
		task: { id: 1, status: 'todo', priority: 'low' },
		expected: true,
	},
	{ name: 'nullはfalseになる', task: null, expected: false },
	{ name: '空のオブジェクトはfalseになる', task: {}, expected: false },
	{
		name: 'idがNaNだとfalseになる',
		task: { id: NaN, status: 'active', priority: 'low' },
		expected: false,
	},
	{
		name: 'idが文字列だとfalseになる',
		task: { id: 'xxx', status: 'done', priority: 'low' },
		expected: false,
	},
	{
		name: 'statusが知らない値だとfalseになる',
		task: { id: 3, status: 'xxx', priority: 'low' },
		expected: false,
	},
	{
		name: 'priorityが知らない値だとfalseになる',
		task: { id: 4, status: 'todo', priority: 'xxx' },
		expected: false,
	},
];

taskCases.forEach(({ name, task, expected }) => {
	test(name, () => {
		assert.strictEqual(isValidTask(task), expected);
	});
});

// isValidMemoのテスト
const memoCases = [
	{
		name: '正しいメモはtrueになる',
		memo: { id: 1, content: 'メモ', color: 'red' },
		expected: true,
	},
	{ name: 'nullはfalseになる', memo: null, expected: false },
	{ name: '空のオブジェクトはfalseになる', memo: {}, expected: false },
	{
		name: 'idがNaNだとfalseになる',
		memo: { id: NaN, content: 'メモ', color: 'red' },
		expected: false,
	},
	{
		name: 'idが文字列だとfalseになる',
		memo: { id: 'xxx', content: 'メモ', color: 'red' },
		expected: false,
	},
	{
		name: 'contentが文字列でないとfalseになる',
		memo: { id: 1, content: 123, color: 'red' },
		expected: false,
	},
	{
		name: 'colorがないとfalseになる',
		memo: { id: 1, content: 'メモ' },
		expected: false,
	},
	{
		name: 'colorが空文字だとfalseになる',
		memo: { id: 1, content: 'メモ', color: '' },
		expected: false,
	},
	{
		name: 'colorに空白が入っているとfalseになる',
		memo: { id: 1, content: 'メモ', color: ' ' },
		expected: false,
	},
];

memoCases.forEach(({ name, memo, expected }) => {
	test(name, () => {
		assert.strictEqual(isValidMemo(memo), expected);
	});
});
