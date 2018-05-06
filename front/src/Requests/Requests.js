/* global location */
/* eslint no-restricted-globals: ["off", "location"] */
import Task from "../Task/Task";
import Category from "../Category/Category"

function showRestartAlert(message) {
    let restartMessage = "\nDo you want to refresh page?";
    let finalMessage = message + restartMessage;

    let answer = confirm(finalMessage);

    if (answer){
        window.location.reload();
    }
}
export function getDailyTasks(day){
    let tasks = [];
    fetch('http://localhost:8080/task/dailyTasks/date=' + day)
        .then(res => {

            if (res.status !== 200){
                showRestartAlert("Oops! Problem with server. Cannot load tasks.");
            }
            return res.json();
        })
        .then(data => {
            for (let i = 0; i < data.length; i++){
                let newTask = new Task(data[i].title, data[i].id);
                newTask.setState(data[i].done);
                let date = data[i].deadline.substr(0, 10).replace(" ", '-').replace(" ", '-');
                newTask.setDate(date);

                tasks.push(newTask);
            }
        }).catch(function() {
        showRestartAlert("Oops! Problem with server. Cannot load tasks.");
    });
    return tasks;
}
export function getUnassignedTasks(){
    let tasks = [];
    fetch('http://localhost:8080/task/unassigned')
        .then(res => {
            if (res.status !== 200){
                showRestartAlert("Oops! Problem with server. Cannot load tasks.");
            }
            return res.json();
        })
        .then(data => {
            for (let i = 0; i < data.length; i++){
                let newTask = new Task(data[i].title, data[i].id);
                newTask.setState(data[i].done);
                tasks.push(newTask);
            }
        }).catch(function() {
        showRestartAlert("Oops! Problem with server. Cannot load tasks.");
    });

    return tasks;

}
export function markRequest(selectedTask) {
    let data = new URLSearchParams("title=" + selectedTask.getName() + "&done="+ selectedTask.getState());
    fetch('http://localhost:8080/task/setDone' + selectedTask.getID(), { method: 'POST', body: data})
        .then(res => {
        if (res.status !== 200){
            showRestartAlert("Oops! Problem with server. Your changes won't be saved.");
        }
    }).catch(function() {
        showRestartAlert("Oops! Problem with server. Your changes won't be saved.");
    });

}
export function assignToDate(selectedTask) {
    let data = new URLSearchParams("taskID=" + selectedTask.getID() + "&date="+ selectedTask.getDate());
    fetch('http://localhost:8080/task/setDate', { method: 'POST', body: data})
        .then(res => {
            if (res.status !== 200){
                showRestartAlert("Oops! Problem with server. Your changes won't be saved.");
            }
        }).catch(function() {
        showRestartAlert("Oops! Problem with server. Your changes won't be saved.");
    });

}

export function markAndDropRequest(selectedTask, newParentTask) {
    let data = new URLSearchParams("done="+ selectedTask.getState());
    fetch('http://localhost:8080/task/drop/' + selectedTask.getID() + '/' + newParentTask.getID(), { method: 'POST', body: data})
        .then(res => {
            if (res.status !== 200){
                showRestartAlert("Oops! Problem with server. Your changes won't be saved.");
            }
        }).catch(function() {
        showRestartAlert("Oops! Problem with server. Your changes won't be saved.");
    });

}

export function addRequest(newTaskName) {
    let data = new URLSearchParams("title=" + newTaskName);
    let newTask = new Task(newTaskName, -1);
    fetch('http://localhost:8080/task/create', { method: 'POST', body: data})
        .then(res => {
            if (res.status !== 200){
                showRestartAlert("Oops! Problem with server. Your changes won't be saved.");
            }
            return res.json();
        })
        .then(data => {
            newTask.setID(data.id);
            newTask.setState(data.done);

        }).catch(function() {
            showRestartAlert("Oops! Problem with server. Your changes won't be saved.");
    });
    return newTask;
}
export function getAllTasks() {
    let tasks = [];
    fetch('http://localhost:8080/task/getAll')
        .then(res => {
            if (res.status !== 200){
                showRestartAlert("Oops! Problem with server. Cannot load tasks.");
            }
            return res.json();
        })
        .then(data => {
            for (let i = 0; i < data.length; i++){
                let newTask = new Task(data[i].title, data[i].id);
                newTask.setState(data[i].done);

                tasks.push(newTask);
            }
        }).catch(function() {
            showRestartAlert("Oops! Problem with server. Cannot load tasks.");
    });
    return tasks;
}

export function deleteRequest(selectedTask) {
    fetch('http://localhost:8080/task/delete' + selectedTask.getID(), { method: 'DELETE'})
        .then(res => {
        if (res.status !== 200){
            showRestartAlert("Oops! Problem with server. Your changes won't be saved.");
        }
        }).catch(function() {
            showRestartAlert("Oops! Problem with server. Your changes won't be saved.");
    });
}

export function swapRequest(oldIndex, newIndex) {
    let params;
    if (newIndex === null) params = "taskID=" + oldIndex;
    else params = "taskID=" + oldIndex + "&newParentTaskId=" + (newIndex);
    let data = new URLSearchParams(params);
    fetch('http://localhost:8080/task/move', { method: 'POST', body: data})
        .then(res => {
        if (res.status !== 200){
            showRestartAlert("Oops! Problem with server. Your changes won't be saved.");
        }
    }).catch(function() {
        showRestartAlert("Oops! Problem with server. Your changes won't be saved.");
    });
}

export function getAllCategories() {
    let categories = [];
    fetch('http://localhost:8080/category/getBase')
        .then(res => {
            if (res.status !== 200){
                showRestartAlert("Oops! Problem with server. Cannot load tasks.");
            }
            return res.json();
        })
        .then(data => {
            for (let i = 0; i < data.length; i++){
                let newCategory = new Category(data[i].name, data[i].id, data[i].parent_id);

                categories.push(newCategory);
            }
        }).catch(function() {
        showRestartAlert("Oops! Problem with server. Cannot load tasks.");
    });
    return categories;
}
