class Task {
    constructor(title, id) {
        this.name = title;
        this.done = false;
        this.id = id;
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
    setState = function (newState){
        this.done = newState;
    }

}

export default Task;