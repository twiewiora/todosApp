class Task {
    constructor(title, id) {
        this.name = title;
        this.done = false;
        this.id = id;
        this.date = null;
        this.categoryId = null;
        this.categoryName = null;
        this.deadline = null;
        this.description="";
    }

    getState = function () {
        return this.done
    };
    getName = function () {
        return this.name
    };
    getID = function () {
        return this.id
    };
    getCategoryID = function () {
        return this.categoryId;
    };
    getCategoryName = function () {
        return this.categoryName;
    };
    getDate = function () {
        return this.date;
    };
    setID = function (id) {
        this.id = id;
    };
    setCategory = function (category) {
        this.categoryId = category;
    };
    setCategoryName = function (categoryName) {
        this.categoryName = categoryName == null ? "None" : categoryName;
    };
    setDate = function (date) {
        this.date = date;
    };
    setState = function (newState) {
        this.done = newState;
    };
    setName = function (name) {
        this.name = name;
    };
    getDescription = function () {
        return this.description;
    }
    setDescription = function (newDescription) {
        this.description = newDescription;
    }
}

export default Task;