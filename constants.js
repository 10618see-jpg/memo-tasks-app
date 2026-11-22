// ステータス表示名の対応表
export const statusLabel = {
	todo: { label: '開始前' },
	active: { label: '作業中' },
	done: { label: '完了' },
};
export const STATUSES = Object.keys(statusLabel);

// ステータスの役割（最初・完了）と、実際の値の対応
export const STATUS_ROLES = {
	initial: 'todo',
	completed: 'done',
};

// 優先度バッジのオブジェクト
export const priorityBadges = {
	low: { label: '低', color: 'priority-low' },
	medium: { label: '中', color: 'priority-medium' },
	high: { label: '高', color: 'priority-high' },
};
export const ALLOWED_PRIORITIES = Object.keys(priorityBadges);
