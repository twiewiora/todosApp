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
    let tasks = [];
    fetch(host + '/task/dailyTasks/date=' + day)
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
                newTask.setCategory(data[i].categoryId);
                let date = data[i].deadline.substr(0, 10).replace(" ", '-').replace(" ", '-');
                newTask.setDate(date);

                tasks.push(newTask);
            }
        }).catch(function () {
        showRestartAlert("Oops! Problem with server. Cannot load tasks.");
    });
    return tasks;
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
    let tasks = [];
    fetch(host + '/task/unassigned')
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
                newTask.setCategory(data[i].categoryId);
                tasks.push(newTask);
            }
        }).catch(function () {
        showRestartAlert("Oops! Problem with server. Cannot load tasks.");
    });

    return tasks;

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
    fetch(host + '/task/create', {method: 'POST', body: data})
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

        }).catch(function () {
        showRestartAlert("Oops! Problem with server. Your changes won't be saved.");
    });
    return newTask;
}

export function addWithCategoryRequest(newTaskName, categoryId) {
    let data = new URLSearchParams("title=" + newTaskName + "&categoryID=" + categoryId);
    let newTask = new Task(newTaskName, -1);
    fetch(host + '/task/create', {method: 'POST', body: data})
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

        }).catch(function () {
        showRestartAlert("Oops! Problem with server. Your changes won't be saved.");
    });
    return newTask;
}

export function addCategoryRequest(newCategoryName, parentID) {
    let data = new URLSearchParams("name=" + newCategoryName + "&parentCategoryId=" + parentID);
    let newCategory = new Category(newCategoryName, -1, parentID);
    fetch(host + '/category/create', {method: 'POST', body: data})
        .then(res => {
            if (res.status !== 200) {
                showRestartAlert("Oops! Problem with server. Your changes won't be saved.");
            }
            return res.json();
        })
        .then(data => {
            newCategory.setID(data.id);

        }).catch(function () {
        showRestartAlert("Oops! Problem with server. Your changes won't be saved.");
    });
    return newCategory;
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
    let tasks = [];
    Promise.all([
        fetch(host + '/task/getAll'),
        fetch(host + '/category/getAll')
    ])
        .then(([taskResult, categoryResult]) => {
            if (taskResult.status !== 200 && categoryResult.status !== 200) {
                showRestartAlert("Oops! Problem with server. Cannot load tasks.");
            }
            return [taskResult.json(), categoryResult.json()];
        })
        .then(([taskData, categoryData]) => {
            taskData.then(data => {
                categoryData.then(categories => {
                    let categoryIdToNameMap = categories.reduce((result, category) => {
                        result[category.id] = category.name;
                        return result
                    }, {});

                    for (let i = 0; i < data.length; i++) {
                        let newTask = new Task(data[i].title, data[i].id);
                        newTask.setState(data[i].done);
                        newTask.setCategory(data[i].categoryId);
                        newTask.setCategoryName(categoryIdToNameMap[data[i].categoryId]);
                        newTask.setDate(data[i].deadline);
                        tasks.push(newTask);
                    }
                })
            })
        }).catch(function () {
        showRestartAlert("Oops! Problem with server. Cannot load tasks.");
    });
    return tasks;
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
                showRestartAlert("Oops! Problem with server. Cannot load tasks.");
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
            showRestartAlert("Oops! Problem with server. Cannot load tasks.");
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
        .then(data => {
            const categories = [];
            for (let i = 0; i < data.length; i++) {
                let newCategory = new Category(data[i].name, data[i].id, data[i].parentCategoryId);
                categories.push(newCategory);
            }
            return categories;
        }).catch(function () {
        showRestartAlert("Oops! Problem with server. Cannot load tasks.");
    });
}

export function getAllTasksFromCategory(category) {
    let tasks = [];
    fetch(host + '/task/category' + category.getID())
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
                newTask.setDate(data[i].deadline);
                newTask.setCategory(data[i].categoryId);

                tasks.push(newTask);
            }
        }).catch(function () {
        showRestartAlert("Oops! Problem with server. Cannot load tasks.");
    });
    return tasks;
}
