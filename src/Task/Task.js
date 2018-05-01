class Task {
    constructor(title, id) {
        this.name = title;
        this.done = false;
        this.id = id;
        this.date = null;
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
    setID = function (id) {
        this.id = id;
    };
    getDate = function () {
        return this.date;
    };
    setDate = function (date) {
        this.date = date;
    };
    setState = function (newState){
        this.done = newState;
    }

}

export default Task;