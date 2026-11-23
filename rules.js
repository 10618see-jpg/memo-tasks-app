import { STATUSES, ALLOWED_PRIORITIES } from './constants.js';

// 次のステータスに進む方向を表す定数
const NEXT_DIRECTION = 1;
// 前のステータスに戻る方向を表す定数
const PREVIOUS_DIRECTION = -1;

// 隣のステータスを求める関数
const getAdjacentStatus = (currentStatus, direction) => {
	const currentIndex = STATUSES.indexOf(currentStatus);
	// 現在のステータスが有効かどうかを確認
	// indexが-1の場合は現在のステータスが無効なのでnullを返す
	if (currentIndex === -1) return null;
	const adjacentIndex = currentIndex + direction;
	if (adjacentIndex < 0 || adjacentIndex >= STATUSES.length) return null;
	return STATUSES[adjacentIndex];
};

// 次のタスクステータスを取得する関数
export const getNextStatus = (currentStatus) => {
	return getAdjacentStatus(currentStatus, NEXT_DIRECTION); //NEXT_DIRECTION以外を渡さない
};

// 前のタスクステータスを取得
export const getPreviousStatus = (currentStatus) => {
	return getAdjacentStatus(currentStatus, PREVIOUS_DIRECTION); //PREVIOUS_DIRECTION以外を渡さない
};

// タスクの検証関数
export const isValidTask = (task) => {
	if (!task) return false;
	if (!Number.isFinite(task.id)) return false;
	if (!STATUSES.includes(task.status)) return false;
	if (!ALLOWED_PRIORITIES.includes(task.priority)) return false;
	return true;
};

// メモの検証関数
export const isValidMemo = (memo) => {
	if (!memo) return false;
	if (!Number.isFinite(memo.id)) return false;
	if (typeof memo.content !== 'string') return false;
	// 色は「空でなく、空白を含まない文字列」であれば許可する（classList.addで落ちないため）
	if (typeof memo.color !== 'string' || memo.color === '' || /\s/.test(memo.color)) return false;
	return true;
};
