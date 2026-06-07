
```dataviewjs
const targetFolder = '"20_Areas/Daily_Logs"';
const scanWindow = dv.date('today').minus({days: 7});

const pendingTasks = dv.pages(targetFolder)
    .where(page => page.file.cday >= scanWindow)
    .file.tasks
    .where(task => !task.completed && task.text.trim() !== "");

if (pendingTasks.length > 0) {
    dv.header(3, "Backlog Tasks (Last 7 Days)");
    dv.taskList(pendingTasks, false);
} else {
    dv.paragraph("Clear! Hệ thống không còn task tồn đọng.");
}
```
