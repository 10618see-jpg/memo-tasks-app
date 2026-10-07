 // タスクデータ
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

// タスク配列
const tasks = [task1, task2, task3];

// タスクのタイトルをコンソールに出力
tasks.forEach(task => {
    console.log(task.title);
});

// status関数
const renderTasksByStatus = (status) => {
    const listElement = document.querySelector(`ul[data-status='${status}']`);
    const filteredTasks = tasks.filter(task => task.status === status);
    filteredTasks.forEach(task => {
        const listItem = document.createElement("li");
        listItem.textContent = task.title;
        listElement.appendChild(listItem);
    });
};

//関数の呼び出し
renderTasksByStatus("todo");
renderTasksByStatus("done");
renderTasksByStatus("active");

// メモデータ
const memo1 = {
    id: 1,
    content: "メモの内容",
    createdAt: new Date().toISOString()
};

const memo2 = {
    id: 2,
    content: "メモの内容2",
    createdAt: new Date().toISOString()
};

// メモ配列
const memos = [memo1, memo2];

// メモをコンソールに出力
memos.forEach(memo => {
    console.log(memo.content);
});

// メモを表示する関数
const renderMemos = () => {
    const memoArea = document.getElementById("memo-list");
    memos.forEach(memo => {
        const memoItem = document.createElement("li");
        const memoContent = document.createElement("p");
        memoContent.textContent = memo.content;
        const memoCreatedAt = document.createElement("time");
        memoCreatedAt.textContent = `作成日: ${memo.createdAt}`;
        memoCreatedAt.setAttribute("datetime", memo.createdAt);
        memoItem.appendChild(memoContent);
        memoItem.appendChild(memoCreatedAt);
        memoArea.appendChild(memoItem);
    });
};

// 関数の呼び出し
renderMemos();