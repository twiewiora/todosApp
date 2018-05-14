class Task {
    constructor(title, id) {
        this.name = title;
        this.done = false;
        this.id = id;
        this.date = null;
        this.categoryId = null;
        this.categoryName = null;
        this.visible = true;
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
    getCategory = function () {
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
    setVisible = function (newVisible) {
        this.visible = newVisible;
    };
}

export default Task;