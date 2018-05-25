/* global location */
/* eslint no-restricted-globals: ["off", "location"] */
import Task from "../Task/Task";
import Category from "../Category/Category"

let host = 'http://localhost:8080';

function showRestartAlert(message) {
    let restartMessage = "\nDo you want to refresh page?";
    let finalMessage = message + restartMessage;

    let answer = confirm(finalMessage);

    if (answer) {
        window.location.reload();
    }
}

export function getDailyTasks(day) {
    return fetch(host + '/task/dailyTasks/date=' + day)
        .then(res => {
            if (res.status !== 200) {
                showRestartAlert("Oops! Problem with server. Cannot load tasks.");
            }
            return res.json();
        })
        .then(data => {
            return data.map(t => {
                let newTask = new Task(t.title, t.id);
                newTask.setState(t.done);
                newTask.setCategory(t.categoryId);
                let date = t.deadline.substr(0, 10).replace(" ", '-').replace(" ", '-');
                newTask.setDate(date);
                return newTask;
            })
        })
        .then(tasks => {
            console.log(tasks);
            return tasks;
        })
        .catch(function () {
            showRestartAlert("Oops! Problem with server. Cannot load tasks.");
        });
}
export function getWeeklyTasks(day) {
    let tasks = [];
    fetch(host + '/task/weeklyTasks/date=' + day)
        .then(res => {
            if (res.status !== 200) {
                showRestartAlert("Oops! Problem with server. Cannot load tasks.");
            }
            return res.json();
        })
        .then(data => {
            for (let i = 0; i < data.length; i++) {
                let newTask = new Task(data[i].title, data[i].id);
                newTask.setState(data[i].done);
                newTask.setState(data[i].deadline);

                tasks.push(newTask);
            }

        }).catch(function () {
        showRestartAlert("Oops! Problem with server. Cannot load tasks.");
    });
    return tasks;
}
export function getUnassignedTasks() {
    return fetch(host + '/task/unassigned')
        .then(res => {
            if (res.status !== 200) {
                showRestartAlert("Oops! Problem with server. Cannot load tasks.");
            }
            return res.json();
        })
        .then(data => {
            return data.map(task => {
                let newTask = new Task(task.title, task.id);
                newTask.setState(task.done);
                newTask.setCategory(task.categoryId);
                return newTask;
            });
        })
        .catch(function () {
            showRestartAlert("Oops! Problem with server. Cannot load tasks.");
        });
}

export function markRequest(selectedTask) {
    let data = new URLSearchParams("title=" + selectedTask.getName() + "&done=" + selectedTask.getState());
    fetch(host + '/task/setDone' + selectedTask.getID(), {method: 'POST', body: data})
        .then(res => {
            if (res.status !== 200) {
                showRestartAlert("Oops! Problem with server. Your changes won't be saved.");
            }
        }).catch(function () {
        showRestartAlert("Oops! Problem with server. Your changes won't be saved.");
    });
}

export function assignToDate(selectedTask) {
    let data = new URLSearchParams("taskID=" + selectedTask.getID() + "&date=" + selectedTask.getDate());
    fetch(host + '/task/setDate', {method: 'POST', body: data})
        .then(res => {
            if (res.status !== 200) {
                showRestartAlert("Oops! Problem with server. Your changes won't be saved.");
            }
        }).catch(function () {
        showRestartAlert("Oops! Problem with server. Your changes won't be saved.");
    });
}

export function unassignFromDate(selectedTask) {
    let data = new URLSearchParams("taskID=" + selectedTask.getID());
    fetch(host + '/task/unsetDate', {method: 'POST', body: data})
        .then(res => {
            if (res.status !== 200) {
                showRestartAlert("Oops! Problem with server. Your changes won't be saved.");
            }
        }).catch(function () {
        showRestartAlert("Oops! Problem with server. Your changes won't be saved.");
    });
}

export function markAndDropRequest(selectedTask, newParentTask) {
    let params;
    if (newParentTask === null) params = "id=" + selectedTask.getID();
    else params = "id=" + selectedTask.getID() + "&parent=" + (newParentTask.getID());
    let data = new URLSearchParams(params);
    let link = host + '/task/drop';
    fetch(link, {method: 'POST', body: data})
        .then(res => {
            if (res.status !== 200) {
                showRestartAlert("Oops! Problem with server. Your changes won't be saved.");
            }
        }).catch(function () {
        showRestartAlert("Oops! Problem with server. Your changes won't be saved.");
    });
}

export function addRequest(newTaskName) {
    let data = new URLSearchParams("title=" + newTaskName);
    let newTask = new Task(newTaskName, -1);
    return fetch(host + '/task/create', {method: 'POST', body: data})
        .then(res => {
            if (res.status !== 200) {
                showRestartAlert("Oops! Problem with server. Your changes won't be saved.");
            }
            return res.json();
        })
        .then(data => {
            newTask.setID(data.id);
            newTask.setCategory(data.categoryId);
            newTask.setCategoryName(null);
            newTask.setState(data.done);
            newTask.setDate(null);
            return newTask;

        }).catch(function () {
            showRestartAlert("Oops! Problem with server. Your changes won't be saved.");
        });
}

export function addWithCategoryRequest(newTaskName, categoryId) {
    let data = new URLSearchParams("title=" + newTaskName + "&categoryID=" + categoryId);
    let newTask = new Task(newTaskName, -1);
    return fetch(host + '/task/create', {method: 'POST', body: data})
        .then(res => {
            if (res.status !== 200) {
                showRestartAlert("Oops! Problem with server. Your changes won't be saved.");
            }
            return res.json();
        })
        .then(data => {
            newTask.setID(data.id);
            newTask.setCategory(data.categoryId);
            newTask.setState(data.done);
            return newTask;

        }).catch(function () {
            showRestartAlert("Oops! Problem with server. Your changes won't be saved.");
        });
}

export function addCategoryRequest(newCategoryName, parentID) {
    let data = new URLSearchParams("name=" + newCategoryName + "&parentCategoryId=" + parentID);
    let newCategory = new Category(newCategoryName, -1, parentID);
    return fetch(host + '/category/create', {method: 'POST', body: data})
        .then(res => {
            if (res.status !== 200) {
                showRestartAlert("Oops! Problem with server. Your changes won't be saved.");
            }
            return res.json();
        })
        .then(data => {
            newCategory.setID(data.id);
            return newCategory;

        }).catch(function () {
            showRestartAlert("Oops! Problem with server. Your changes won't be saved.");
        });
}

export function deleteCategoryRequest(selectedCategory) {
    return fetch(
        `${host}/category/delete${selectedCategory.getID()}`,
        {method: 'DELETE'}
    )
        .then(res => {
            if (res.status !== 200) {
                showRestartAlert("Oops! Problem with server. Your changes won't be saved.");
                throw new Error();
            }
        })
        .catch(() => {
            showRestartAlert("Oops! Problem with server. Your changes won't be saved.");
            throw new Error();
        });
}

export function getAllTasks() {
    return Promise.all([
        fetch(host + '/task/getAll'),
        fetch(host + '/category/getAll')
    ])
        .then(([taskResult, categoryResult]) => {
            if (taskResult.status !== 200 || categoryResult.status !== 200) {
                showRestartAlert("Oops! Problem with server. Cannot load tasks 1.");
            }
            return [taskResult.json(), categoryResult.json()];
        })
        .then(([taskData, categoryData]) => {
            return taskData.then(data => {
                console.log(categoryData);
                return categoryData.then(categories => {
                    let categoryIdToNameMap = categories.reduce((result, category) => {
                        result[category.id] = category.name;
                        return result
                    }, {});

                    return data.map(task => {
                        let newTask = new Task(task.title, task.id);
                        newTask.setState(task.done);
                        newTask.setCategory(task.categoryId);
                        newTask.setCategoryName(categoryIdToNameMap[task.categoryId]);
                        return newTask;
                    })
                })
            })
        })
        .then(taskData => {
            console.log('getAllTasks'+taskData);
            return taskData})
        .catch(()=> {
            showRestartAlert("Oops! Problem with server. Cannot load tasks. 2");
        });
}

export function deleteRequest(selectedTask) {
    fetch(host + '/task/delete' + selectedTask.getID(), {method: 'DELETE'})
        .then(res => {
            if (res.status !== 200) {
                showRestartAlert("Oops! Problem with server. Your changes won't be saved.");
            }
        }).catch(function () {
        showRestartAlert("Oops! Problem with server. Your changes won't be saved.");
    });
}

export function swapRequest(oldIndex, newIndex) {
    let params;
    if (newIndex === null) params = "taskID=" + oldIndex;
    else params = "taskID=" + oldIndex + "&newParentTaskId=" + (newIndex);
    let data = new URLSearchParams(params);
    fetch(host + '/task/move', {method: 'POST', body: data})
        .then(res => {
            if (res.status !== 200) {
                showRestartAlert("Oops! Problem with server. Your changes won't be saved.");
            }
        }).catch(function () {
        showRestartAlert("Oops! Problem with server. Your changes won't be saved.");
    });
}

export function getAllCategories() {
    return fetch(host + '/category/getAll')
        .then(res => {
            if (res.status !== 200) {
                showRestartAlert("Oops! Problem with server. Cannot load categories.");
            }
            return res.json();
        })
        .then(data =>
            data.map(cat =>
                new Category(cat.name, cat.id, cat.parentCategoryId)
            )
        )
        .then(data => {
            console.log('getAllCategories', data);
            return data;
        })
        .catch(() => {
            showRestartAlert("Oops! Problem with server. Cannot load categories 1 .");
        });
}

export function getSubcategories(parentCategory) {
    return fetch(host + '/category/subcategories/' + parentCategory.getID())
        .then(res => {
            if (res.status !== 200) {
                showRestartAlert("Oops! Problem with server. Cannot load tasks.");
            }
            return res.json();
        })
        .then(data =>
            data.map(category => new Category(category.name, category.id, category.parentCategoryId))
        ).catch(function () {
            showRestartAlert("Oops! Problem with server. Cannot load tasks.");
        });
}

export function getAllTasksFromCategory(category) {
    return fetch(host + '/task/category' + category.getID())
        .then(res => {
            if (res.status !== 200) {
                showRestartAlert("Oops! Problem with server. Cannot load tasks.");
            }
            return res.json();
        })
        .then(data => {
            return data.map(task => {
                let newTask = new Task(task.title, task.id);
                newTask.setState(task.done);
                newTask.setDate(task.deadline);
                newTask.setCategory(task.categoryId);
                return newTask;
            })
        }).catch(function () {
            showRestartAlert("Oops! Problem with server. Cannot load tasks.");
        });
}
