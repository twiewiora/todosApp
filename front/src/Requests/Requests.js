import Task from "../Task/Task";

export function markRequest(selectedTask) {
    let data = new URLSearchParams("title=" + selectedTask.getName() + "&done="+ selectedTask.getState());
    fetch('http://localhost:8080/task/setDone' + selectedTask.getID(), { method: 'POST', body: data});

}
export function addRequest(newTask) {
    let data = new URLSearchParams("title=" + newTask.getName());
    fetch('http://localhost:8080/task/create', { method: 'POST', body: data})
        .then(res => {
            return res.json();
        })
        .then(data => {
            newTask.setID(data.id);
            newTask.setState(data.done);

        });
    return newTask;
}
export function getAllTasks() {
    let tasks = [];
    fetch('http://localhost:8080/task/getAll')
        .then(res => {
            return res.json();
        })
        .then(data => {
            for (let i = 0; i < data.length; i++){
                let newTask = new Task(data[i].title, data[i].id);
                newTask.setState(data[i].done);

                tasks.unshift(newTask);
            }
        });
    console.log(tasks);
    return tasks;
}

export function deleteRequest(selectedTask) {
    fetch('http://localhost:8080/task/delete' + selectedTask.getID(), { method: 'DELETE'});
}

export function swapRequest(oldIndex, newIndex) {
    let params;
    if (newIndex === 0) params = "taskID=" + oldIndex;
    else params = "taskID=" + oldIndex + "&newParentTaskId=" + (newIndex-1);
    let data = new URLSearchParams(params);
    fetch('http://localhost:8080/task/move', { method: 'POST', body: data});
}