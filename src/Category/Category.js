class Category {
    constructor(title, id, parent_id) {
        this.name = title;
        this.id = id;
        this.parentCategoryId = parent_id;
    }
    getParentID = function () {
        return this.parentCategoryId
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
        this.parentCategoryId = newParent
    }

    setName = function (newName){
        this.name = newName
    }
}

export default Category;