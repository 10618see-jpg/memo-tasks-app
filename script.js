import {
	STATUSES,
	STATUS_ROLES,
	priorityBadges,
	ALLOWED_PRIORITIES,
	statusLabel,
} from './constants.js';

import { getNextStatus, getPreviousStatus, isValidTask, isValidMemo } from './rules.js';

// LocalStorageのキーを管理するオブジェクト
const STORAGE_KEYS = {
	tasks: 'tasks',
	memos: 'memos',
};

// タスクを保存する関数
const saveTasks = (tasksToSave) => {
	localStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(tasksToSave));
};

// タスクを読み込む関数
const loadTasks = () => {
	try {
		const stringifiedTasks = localStorage.getItem(STORAGE_KEYS.tasks);
		if (!stringifiedTasks) return [];
		const parsedTasks = JSON.parse(stringifiedTasks);
		if (Array.isArray(parsedTasks)) {
			// 配列内の各タスクが有効かどうかを確認
			const validTasks = parsedTasks.filter(isValidTask);
			if (validTasks.length !== parsedTasks.length) {
				console.warn(
					`無効なタスクを${parsedTasks.length - validTasks.length}件除外しました`
				);
			}
			return validTasks;
		}
		console.error('LocalStorageタスクデータが不正です:', parsedTasks);
		return [];
	} catch (error) {
		console.error('LocalStorageからのデータ取得に失敗しました:', error);
		return [];
	}
};

// 表示対象のタスクを保存データから読み込む
let tasks = loadTasks();

// タスクを追加する関数
const addTask = (newTask) => {
	tasks = [...tasks, newTask];
	saveTasks(tasks);
	render();
};

// タスクを削除する関数
const removeTask = (taskId) => {
	tasks = tasks.filter((task) => task.id !== taskId);
	saveTasks(tasks);
	render();
};

// 次のタスクステータスに書き換える関数
const advanceTask = (taskId) => {
	const task = tasks.find((t) => t.id === taskId);
	if (!task) return;
	const nextStatus = getNextStatus(task.status);
	if (!nextStatus) return;
	const completedAt =
		nextStatus === STATUS_ROLES.completed ? new Date().toISOString() : task.completedAt;
	tasks = tasks.map((t) =>
		t.id === taskId ? { ...t, status: nextStatus, completedAt: completedAt } : t
	);
	saveTasks(tasks);
	render();
};

// 前のタスクステータスに戻す
const revertTask = (taskId) => {
	const task = tasks.find((t) => t.id === taskId);
	if (!task) return;
	const previousStatus = getPreviousStatus(task.status);
	if (!previousStatus) return;
	tasks = tasks.map((t) =>
		t.id === taskId ? { ...t, status: previousStatus, completedAt: null } : t
	);
	saveTasks(tasks);
	render();
};

// 全てのステータスのタスクを描画する関数
const renderAllTasks = () => {
	STATUSES.forEach((status) => renderTasksByStatus(status));
};

// 描画関数をまとめて呼び出す関数
const render = () => {
	renderAllTasks();
	renderMemos();
};

// ボタン1つを作成する関数
const createButton = ({ text, className, ariaLabel }) => {
	const button = document.createElement('button');
	button.textContent = text;
	button.type = 'button';
	button.classList.add(className);
	button.setAttribute('aria-label', ariaLabel);
	return button;
};

// タスク 1 件のリスト項目を作る関数
const createTaskItem = (task) => {
	// タスク項目の作成
	const taskItem = document.createElement('li');
	taskItem.dataset.id = task.id;

	// タスクタイトルの作成
	const taskTitle = document.createElement('h4');
	taskTitle.textContent = task.title;
	taskTitle.classList.add('task-title');
	taskItem.appendChild(taskTitle);

	// タスク内容の作成
	const taskContent = document.createElement('p');
	taskContent.textContent = task.content;
	taskContent.classList.add('task-content');
	taskItem.appendChild(taskContent);

	// 期限日の作成
	const dueDate = document.createElement('time');
	dueDate.textContent = `期限日: ${new Date(task.dueDate).toLocaleDateString()}`;
	dueDate.setAttribute('datetime', task.dueDate);
	dueDate.classList.add('task-due-date');
	taskItem.appendChild(dueDate);

	// 優先度バッジの作成
	const priorityBadge = document.createElement('span');
	priorityBadge.textContent = priorityBadges[task.priority].label;
	priorityBadge.classList.add(priorityBadges[task.priority].color, 'priority-badge');
	taskItem.appendChild(priorityBadge);

	// ボタンラッパーの作成
	const buttonWrapper = document.createElement('div');
	buttonWrapper.classList.add('button-wrapper');
	taskItem.appendChild(buttonWrapper);

	// 戻すボタンの作成
	const previousStatus = getPreviousStatus(task.status);
	if (previousStatus) {
		const revertButton = createButton({
			text: '<',
			className: 'revert-button',
			ariaLabel: `${task.title}を${statusLabel[previousStatus].label}に戻す`,
		});
		buttonWrapper.appendChild(revertButton);
	}

	// 進めるボタンの作成
	const nextStatus = getNextStatus(task.status);
	if (nextStatus) {
		const advanceButton = createButton({
			text: '>',
			className: 'advance-button',
			ariaLabel: `${task.title}を${statusLabel[nextStatus].label}に進める`,
		});
		buttonWrapper.appendChild(advanceButton);
	}

	// 削除ボタンの作成
	const deleteButton = createButton({
		text: '×',
		className: 'delete-button',
		ariaLabel: `${task.title}を削除する`,
	});
	taskItem.appendChild(deleteButton);
	return taskItem;
};

// status別にタスクを表示する関数
const renderTasksByStatus = (status) => {
	// 指定されたステータスに対応するリスト要素を取得
	const taskList = document.querySelector(`ul[data-status='${status}']`);
	// 既存のタスクをクリア
	taskList.replaceChildren();
	// 指定されたステータスのタスクだけを抽出
	const filteredTasks = tasks.filter((task) => task.status === status);
	// 抽出したタスクをリスト項目にして画面へ追加
	filteredTasks.forEach((task) => {
		taskList.appendChild(createTaskItem(task));
	});
};

// カンバンボード上のボタンのクリックイベントを設定
const kanbanBoard = document.getElementById('kanban-board');
kanbanBoard.addEventListener('click', (event) => {
	const deleteButton = event.target.closest('button.delete-button');
	const advanceButton = event.target.closest('button.advance-button');
	const revertButton = event.target.closest('button.revert-button');
	if (!deleteButton && !advanceButton && !revertButton) return;
	const taskItem = event.target.closest('li');
	const taskId = Number(taskItem.dataset.id);
	if (deleteButton) {
		const taskTitleText = taskItem.querySelector('.task-title').textContent;
		const isDeleteConfirmed = window.confirm(`${taskTitleText}を削除しますか？`);
		if (isDeleteConfirmed) {
			removeTask(taskId);
		}
	} else if (advanceButton) {
		advanceTask(taskId);
	} else if (revertButton) {
		revertTask(taskId);
	}
});

// 新規タスクフォームを取得して送信処理を設定
const taskForm = document.getElementById('new-task-form');
taskForm.addEventListener('submit', (event) => {
	// フォーム送信時のデフォルト動作をキャンセル
	event.preventDefault();
	// フォームデータを取得
	const formData = new FormData(taskForm);
	// フォームデータをオブジェクトに変換
	const taskData = Object.fromEntries(formData);
	//空白の入力をチェック
	if (!taskData.title.trim() || !taskData.content.trim() || !taskData.dueDate.trim()) {
		alert('タイトル、内容、期限日はすべて入力してください。');
		return;
	}
	// タスクの優先度がホワイトリストに含まれているかチェック
	if (!ALLOWED_PRIORITIES.includes(taskData.priority)) {
		alert('優先度は低、中、高のいずれかで指定してください。');
		return;
	}
	// 新しいタスクオブジェクトを作成
	const newTask = {
		id: Date.now(),
		dueDate: taskData.dueDate,
		title: taskData.title.trim(),
		content: taskData.content.trim(),
		priority: taskData.priority,
		status: STATUS_ROLES.initial,
		completedAt: null,
	};
	// 新しいタスクを追加
	addTask(newTask);
	// フォームをリセット
	taskForm.reset();
});

// タスクフォームのクリアボタンのクリックイベントを設定
const taskFormClearButton = document.getElementById('clear-task-form');
taskFormClearButton.addEventListener('click', () => {
	taskForm.reset();
});

// メモに割り当てる色を候補からランダムに選択
const getRandomMemoColor = () => {
	const colors = ['memo-red', 'memo-blue', 'memo-green', 'memo-yellow'];
	return colors[Math.floor(Math.random() * colors.length)];
};

// メモを保存する関数
const saveMemos = (memosToSave) => {
	localStorage.setItem(STORAGE_KEYS.memos, JSON.stringify(memosToSave));
};

// メモを読み込む関数
const loadMemos = () => {
	try {
		const stringifiedMemos = localStorage.getItem(STORAGE_KEYS.memos);
		if (!stringifiedMemos) return [];
		const parsedMemos = JSON.parse(stringifiedMemos);
		if (Array.isArray(parsedMemos)) {
			// 配列内の各メモが有効かどうかを確認
			const validMemos = parsedMemos.filter(isValidMemo);
			if (validMemos.length !== parsedMemos.length) {
				console.warn(`無効なメモを${parsedMemos.length - validMemos.length}件除外しました`);
			}
			return validMemos;
		}
		console.error('LocalStorageのメモデータが不正です:', parsedMemos);
		return [];
	} catch (error) {
		console.error('LocalStorageからのメモデータ取得に失敗しました:', error);
		return [];
	}
};

// 表示対象のメモを保存データから読み込む
let memos = loadMemos();

// メモを追加する関数
const addMemo = (newMemo) => {
	memos = [newMemo, ...memos];
	saveMemos(memos);
	render();
};

// メモを削除する関数
const removeMemo = (memoId) => {
	memos = memos.filter((memo) => memo.id !== memoId);
	saveMemos(memos);
	render();
};

// メモ1件のリスト項目を作る関数
const createMemoItem = (memo) => {
	// メモ項目の要素を作成
	const memoItem = document.createElement('li');
	memoItem.dataset.id = memo.id;
	// メモの文章を表示する要素を作成
	const memoText = document.createElement('p');
	memoText.textContent = memo.content;
	memoItem.appendChild(memoText);
	// メモの作成日を表示する要素を作成
	const memoCreatedAt = document.createElement('time');
	memoCreatedAt.textContent = `作成日: ${new Date(memo.createdAt).toLocaleDateString()}`;
	memoCreatedAt.setAttribute('datetime', memo.createdAt);
	memoCreatedAt.classList.add('memo-created-at');
	memoItem.appendChild(memoCreatedAt);
	// メモ項目に色とスタイルを設定
	memoItem.classList.add('memo-card', memo.color);
	// メモ項目に削除ボタンを作成
	const deleteButton = createButton({
		text: '×',
		className: 'delete-button',
		ariaLabel: `${memo.content.slice(0, 10)}を削除する`, // aria-labelにメモ内容の先頭10文字を設定
	});
	memoItem.appendChild(deleteButton);
	return memoItem;
};

// メモ一覧を表示する領域を取得
const memoList = document.getElementById('memo-list');
// メモ一覧を画面に表示する関数
const renderMemos = () => {
	// 既存のメモをクリア
	memoList.replaceChildren();
	// 各メモの内容と作成日をリスト項目にして追加
	memos.forEach((memo) => {
		// メモ項目を作成して一覧に追加
		const memoItem = createMemoItem(memo);
		memoList.appendChild(memoItem);
	});
};

// メモ削除ボタンのクリックイベントを設定
memoList.addEventListener('click', (event) => {
	const button = event.target.closest('button.delete-button');
	if (!button) return;
	const memoItem = button.closest('li');
	const memoId = Number(memoItem.dataset.id);
	const isDeleteConfirmed = window.confirm('メモを削除しますか？');
	if (isDeleteConfirmed) {
		removeMemo(memoId);
	}
});

// 新規メモフォームを取得して送信処理を設定
const memoForm = document.getElementById('new-memo-form');
memoForm.addEventListener('submit', (event) => {
	// フォーム送信によるページ再読み込みを防止
	event.preventDefault();
	// 入力されたメモ本文を取得
	const memoContent = document.getElementById('new-memo').value;
	// 空白のメモは追加しない
	if (!memoContent.trim()) {
		alert('メモの内容を入力してください。');
		return;
	}
	// 新しいメモデータを作成
	const newMemo = {
		id: Date.now(),
		content: memoContent.trim(),
		createdAt: new Date().toISOString(),
		color: getRandomMemoColor(),
	};
	// 新しいメモを追加
	addMemo(newMemo);
	// フォームをリセット
	memoForm.reset();
});
// ページ読み込み時に全てのタスクとメモを描画
render();
