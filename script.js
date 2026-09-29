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

// ステータスがtodoのタスクをコンソールに出力
const todoTasks = tasks.filter(task => task.status === "todo");
console.log(todoTasks);

// ステータスがdoneのタスクをコンソールに出力
const doneTasks = tasks.filter(task => task.status === "done");
console.log(doneTasks);

// ステータスがactiveのタスクをコンソールに出力
const activeTasks = tasks.filter(task => task.status === "active");
console.log(activeTasks);

// index.HTMLからステータスがtodoのタスクを抽出
const todoListElement = document.querySelector("ul[data-status='todo']");
console.log(todoListElement);

// ステータスがtodoのタスクをHTMLに追加
todoTasks.forEach(task => {
    const listItem = document.createElement("li");
    listItem.textContent = task.title;
    todoListElement.appendChild(listItem);
});