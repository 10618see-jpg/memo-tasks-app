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
