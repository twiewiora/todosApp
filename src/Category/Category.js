class Category {
    constructor(title, id, parent_id) {
        this.name = title;
        this.id = id;
        this.parent_id = parent_id;
    }
    getParentID = function () {
        return this.parent_id
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
    setParentID = function (newParent){
        this.parent_id = newParent
    }

    setName = function (newName){
        this.name = newName
    }
}

export default Category;