// 表示確認に使うタスクデータを作成
const task1 = {
    id: 1,
    dueDate: "2024-06-30",
    title: "タスク1",
    content: "タスク1の内容",
    priority: "high",
    status: "todo",
    completedAt: null
};

const task2 = {
    id: 2,
    dueDate: "2024-06-30",
    title: "タスク2",
    content: "タスク2の内容",
    priority: "medium",
    status: "done",
    completedAt: new Date().toISOString()
};

const task3 = {
    id: 3,
    dueDate: "2024-06-30",
    title: "タスク3",
    content: "タスク3の内容",
    priority: "low",
    status: "active",
    completedAt: null
};

// 表示対象のタスクを配列にまとめる
let tasks = [task1, task2, task3];

// ステータス表示名の対応表
const statusLabel = {
    todo: { label: "開始前" },
    active: { label: "作業中" },
    done: { label: "完了" }
};
const STATUSES = Object.keys(statusLabel);

// 優先度バッジのオブジェクト
const priorityBadges = {
    low: { label: "低", color: "priority-low" },
    medium: { label: "中", color: "priority-medium" },
    high: { label: "高", color: "priority-high"  }
};
const ALLOWED_PRIORITIES = Object.keys(priorityBadges);

// 次のタスクステータスを取得する関数
const getNextStatus = (currentStatus) => {
    const currentIndex = STATUSES.indexOf(currentStatus);
    // 現在のステータスが有効かどうかを確認
    if (currentIndex === -1) {
        return null;
    }
    if (currentIndex === STATUSES.length - 1) {
        return null;
    }
    return STATUSES[currentIndex + 1];
};

// タスクを保存する関数
const saveTasks = (tasks) => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

// メモを保存する関数
const saveMemos = (memos) => {
    localStorage.setItem("memos", JSON.stringify(memos));
};

// タスクを追加する関数
const addTask = (newTask) => {
    tasks = [...tasks, newTask];
    render();
};

// タスクを削除する関数
const removeTask = (taskId) => {
    tasks = tasks.filter(task => task.id !== taskId);
    render();
};

// 次のタスクステータスに書き換える関数
const advanceTask = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    const nextStatus = getNextStatus(task.status);
    if (!nextStatus) return;
    const completedAt = nextStatus === "done" ? new Date().toISOString() : task.completedAt;
    tasks = tasks.map(t => t.id === taskId ? { ...t, status: nextStatus, completedAt: completedAt } : t);
    render();
};

// 全てのステータスのタスクを描画する関数
const renderAllTasks = () => {
    STATUSES.forEach(status => renderTasksByStatus(status));
};

// 描画関数をまとめて呼び出す関数
const render = () => {
    renderAllTasks();
    renderMemos();
};

// status別にタスクを表示する関数
const renderTasksByStatus = (status) => {
    // 指定されたステータスに対応するリスト要素を取得
    const listElement = document.querySelector(`ul[data-status='${status}']`);
    // 既存のタスクをクリア
    listElement.replaceChildren();
    // 指定されたステータスのタスクだけを抽出
    const filteredTasks = tasks.filter(task => task.status === status);
    // 抽出したタスクをリスト項目にして画面へ追加
    filteredTasks.forEach(task => {
        // タスク名と期限を表示するリスト項目を作成
        const listItem = document.createElement("li");
        const dueDate = document.createElement("time");
        dueDate.textContent = `期限日: ${new Date(task.dueDate).toLocaleDateString()}`;
        dueDate.setAttribute("datetime", task.dueDate);
        const taskTitle = document.createElement("h4");
        taskTitle.classList.add("task-title");
        taskTitle.textContent = task.title;
        listItem.appendChild(taskTitle);
        const taskContent = document.createElement("p");
        taskContent.classList.add("task-content");
        taskContent.textContent = task.content;
        listItem.appendChild(taskContent);
        listItem.appendChild(dueDate);
        listElement.appendChild(listItem);
        dueDate.classList.add("task-due-date");
        // タスクの優先度に対応するラベルとスタイルを設定
        const priorityBadge = document.createElement("span");
        priorityBadge.textContent = priorityBadges[task.priority].label;
        priorityBadge.classList.add(priorityBadges[task.priority].color, "priority-badge");
        listItem.appendChild(priorityBadge);
        // 次のステータスがある場合のみ、進めるボタンを作成して追加
        const nextStatus = getNextStatus(task.status);
        if (nextStatus) {
            const advanceButton = document.createElement("button");
            advanceButton.textContent = ">";
            advanceButton.type = "button";
            advanceButton.classList.add("advance-button");
            advanceButton.setAttribute("aria-label", `${task.title}を${statusLabel[nextStatus].label}に進める`);
            listItem.appendChild(advanceButton);
        }
        // 削除ボタンの作成
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "×";
        listItem.dataset.id = task.id;
        deleteButton.classList.add("delete-button");
        deleteButton.type = "button";
        deleteButton.setAttribute("aria-label", `${task.title}を削除する`);
        listItem.appendChild(deleteButton);
    });
};

// タスク削除ボタンと次のステータスに進むボタンのクリックイベントを設定
const kanbanBoard = document.getElementById("kanban-board");
kanbanBoard.addEventListener("click", (event) => {
    const deleteButton = event.target.closest("button.delete-button");
    const advanceButton = event.target.closest("button.advance-button");
    if (!deleteButton && !advanceButton) return;
    const taskId = Number(event.target.closest("li").dataset.id);
    if (deleteButton) {
        removeTask(taskId);
    } else {
        advanceTask(taskId);
    }
});

// 新規タスクフォームを取得して送信処理を設定
const taskForm = document.getElementById("new-task-form");
taskForm.addEventListener("submit", (event) => {
    // フォーム送信時のデフォルト動作をキャンセル
    event.preventDefault();
    // フォームデータを取得
    const formData = new FormData(taskForm);
    // フォームデータをオブジェクトに変換
    const taskData = Object.fromEntries(formData);
    //空白の入力をチェック
    if (!taskData.title.trim() || !taskData.content.trim() || !taskData.dueDate.trim()) {
        alert("タイトル、内容、期限日はすべて入力してください。");
        return;
    }
    // タスクの優先度がホワイトリストに含まれているかチェック
    if (!ALLOWED_PRIORITIES.includes(taskData.priority)) {
        alert("優先度は低、中、高のいずれかで指定してください。");
        return;
    }
    // 新しいタスクオブジェクトを作成
    const newTask = {
        id: Date.now(),
        dueDate: taskData.dueDate,
        title: taskData.title.trim(),
        content: taskData.content.trim(),
        priority: taskData.priority,
        status: "todo",
        completedAt: null
    };
    // 新しいタスクを追加
    addTask(newTask);
    // フォームをリセット
    taskForm.reset();
});

// メモに割り当てる色を候補からランダムに選択
const getRandomMemoColor = () => {
    const colors = ["memo-red", "memo-blue", "memo-green", "memo-yellow"];
    return colors[Math.floor(Math.random() * colors.length)];
};

// ランダムな色と作成日時を含むメモデータを作成
const memo1 = {
    id: 1,
    content: "メモの内容",
    createdAt: new Date().toISOString(),
    color: getRandomMemoColor(),
};

const memo2 = {
    id: 2,
    content: "メモの内容2",
    createdAt: new Date().toISOString(),
    color: getRandomMemoColor(),
};

// 表示対象のメモを配列にまとめる
let memos = [memo1, memo2];

// メモを追加する関数
const addMemo = (newMemo) => {
    memos = [newMemo, ...memos];
    render();
};

// メモを削除する関数
const removeMemo = (memoId) => {
    memos = memos.filter(memo => memo.id !== memoId);
    render();
};

// メモ一覧を画面に表示する関数
const renderMemos = () => {
    // メモ一覧を表示する領域を取得
    const memoArea = document.getElementById("memo-list");
    // 既存のメモをクリア
    memoArea.replaceChildren();
    // 各メモの内容と作成日をリスト項目にして追加
    memos.forEach(memo => {
        // メモ本文と作成日を表示する要素を作成
        const memoItem = document.createElement("li");
        const memoText = document.createElement("p");
        memoText.textContent = memo.content;
        const memoCreatedAt = document.createElement("time");
        memoCreatedAt.textContent = `作成日: ${new Date(memo.createdAt).toLocaleDateString()}`;
        memoCreatedAt.setAttribute("datetime", memo.createdAt);
        // 作成した要素をメモ項目と一覧領域に組み立てる
        memoItem.appendChild(memoText);
        memoItem.appendChild(memoCreatedAt);
        memoArea.appendChild(memoItem);
        // メモの色と作成日の表示用スタイルを設定
        memoItem.classList.add("memo-card", memo.color);
        memoCreatedAt.classList.add("memo-created-at");
        // 削除ボタンの作成
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "×";
        memoItem.dataset.id = memo.id;
        deleteButton.classList.add("delete-button");
        deleteButton.type = "button";
        deleteButton.setAttribute("aria-label", `${memo.content.slice(0, 10)}を削除する`); // aria-labelにメモ内容の先頭10文字を設定
        memoItem.appendChild(deleteButton);
    });
};

// メモ削除ボタンのクリックイベントを設定
const memoList = document.getElementById("memo-list");
memoList.addEventListener("click", (event) => {
    const button = event.target.closest("button.delete-button");
    if (!button) return;
    const memoId = Number(button.closest("li").dataset.id);
    removeMemo(memoId);
});

// 新規メモフォームを取得して送信処理を設定
const memoForm = document.getElementById("new-memo-form");
memoForm.addEventListener("submit", (event) => {
    // フォーム送信によるページ再読み込みを防止
    event.preventDefault();
    // 入力されたメモ本文を取得
    const memoContent = document.getElementById("new-memo").value;
    // 空白のメモは追加しない
    if (!memoContent.trim()) {
        alert("メモの内容を入力してください。");
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
