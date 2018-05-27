import React, {Component} from 'react';
import MenuIcon from "material-ui/svg-icons/navigation/menu"
import ArrowIcon from "material-ui/svg-icons/navigation/arrow-back"
import './Styles/App.css'
import './Styles/Menu.css'
import TrashIcon from "material-ui/svg-icons/action/delete";
import {addCategoryRequest, deleteCategoryRequest, getAllCategories, getSubcategories} from './Requests/Requests'
import {RaisedButton, TextField} from "material-ui";
import Category from "./Category/Category";

class Menu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentCategory: new Category("Base categories", 1, null),
            childrenCurrentCategory: [],
            trashesVisibility: false
        };
    }

    componentDidMount() {
        getAllCategories()
            .then(childrenCurrentCategory => {
                console.log('Show categories', childrenCurrentCategory);
                this.setState({childrenCurrentCategory});
                this.props.setCurrentCategories(childrenCurrentCategory);
            });
    }

    filterBackwards(e){
        e.stopPropagation();

        getAllCategories().then(data => {
            let currentCategoryID = this.state.currentCategory.getParentID();
            let currentCategory = new Category("Base categories", 1, null);
            let temp = new Category("None", 1, null);
            let categoriesToDisplayInTasks = [];

            if (currentCategoryID !== 1) {
                for (let i = 0; i < data.length; i++) {
                    if (data[i].getID() === currentCategoryID) {
                        currentCategory = data[i];
                        temp = data[i];
                        break;
                    }
                }
            }
            categoriesToDisplayInTasks.push(temp);

            if (currentCategoryID === null) {
                this.props.moveMenuIcon();
                this.props.toggleMenu();
            } else {
                let categories = [];
                for (let i = 0; i < data.length; i++) {
                    if (data[i].getParentID() === currentCategoryID) {
                        categories.push(data[i]);
                        categoriesToDisplayInTasks.push(data[i]);
                    }
                }

                let j = 1;
                while (j !== categoriesToDisplayInTasks.length) {
                    let cID = categoriesToDisplayInTasks[j].getID();

                    for (let k = 0; k < data.length; k++) {
                        if (data[k].getParentID() === cID) {
                            categoriesToDisplayInTasks.push(data[k]);
                        }
                    }
                    j += 1;
                }

                this.setState({
                    currentCategory: currentCategory,
                    childrenCurrentCategory: categories
                });

                this.props.setCurrentCategories(categoriesToDisplayInTasks);
                this.props.setSelectedCategory(currentCategoryID);


            }
        });
    }

    filterCategories(e, i) {
        getAllCategories().then(data => {
            let categories = [];
            let categoriesToDisplayInTasks = [];
            let length = data.length;
            let currentCategory = this.state.childrenCurrentCategory[i];
            let currentCategoryID = currentCategory.getID();
            categoriesToDisplayInTasks.push(currentCategory);

            for (let j = 0; j < length; j++) {
                if (data[j].getParentID() === currentCategoryID) {
                    categories.push(data[j]);
                    categoriesToDisplayInTasks.push(data[j]);
                }
            }

            let j = 1;
            while (j !== categoriesToDisplayInTasks.length) {
                let cID = categoriesToDisplayInTasks[j].getID();

                for (let k = 0; k < length; k++) {
                    if (data[k].getParentID() === cID) {
                        categoriesToDisplayInTasks.push(data[k]);
                    }
                }
                j += 1;
            }

            this.setState({
                currentCategory: currentCategory,
                childrenCurrentCategory: categories
            });

            this.props.setCurrentCategories(categoriesToDisplayInTasks);
            this.props.setSelectedCategory(currentCategoryID);
        });
    }

    addCategory() {
        let name = document.getElementById("categoryName").value;
        console.log(name);

        if (name !== ""){
            let newTask = addCategoryRequest(name, this.state.currentCategory.getID());
            this.setState({
                childrenCurrentCategory: [...this.state.childrenCurrentCategory, newTask]
            });
            document.getElementById('taskName').value = "";
            document.getElementById('taskName').hintText = "Add a category";
        }

    }

    deleteCategory(object, index) {
        //let name = document.getElementById("categoryName").value;

        //TODO
        //if (name !== "") {

        //let taskToDelete = deleteCategoryRequest(name, this.state.name.getID());
        //let temp = this.state.data;
        //temp.push(newTask);
        //this.setState({data : temp});
        //document.getElementById('taskName').value = "";
        //document.getElementById('taskName').hintText = "Add a category";
        //}

        deleteCategoryRequest(this.state.childrenCurrentCategory[index])
            .then(() => getSubcategories(this.state.currentCategory))
            .then(childrenCurrentCategory => {
                this.setState({childrenCurrentCategory});
            });
    }

    showTrashes() {
        this.setState({
            trashesVisibility: !this.state.trashesVisibility,
        });
    }

    render() {
        let visibility = "hide";

        if (this.props.menuVisibility) {
            visibility = "show";
        }

        return (
            <div id="flyoutMenu" className={visibility}> <br/>
                <ArrowIcon style={{ padding: '0px 20px', color: 'white'}}
                           className="BackIcon" onClick={(e) => {this.filterBackwards(e)}}/>
                <h1 className="title">{this.state.currentCategory.getName()}</h1>
                {this.state.childrenCurrentCategory.map((object, index) =>
                    <li key={`item-${index}`}>
                        {
                            this.state.trashesVisibility
                                ? (<TrashIcon id="trashIcon"
                                              style={{
                                                  float: 'right',
                                                  margin: '5px 15px 5px 5px',
                                                  color: 'white',
                                                  cursor: 'pointer'
                                              }}
                                              onClick={() => {
                                                  this.deleteCategory(object, index)
                                              }}/>)
                                : null
                        }

                        <h2 onClick={(e) => {
                            this.filterCategories(e, index)
                        }}>{object.getName()}</h2>
                    </li>)}
                <TextField id="categoryName" style={{margin: '0 8px'}} hintStyle={{color: '#bababa'}} inputStyle={{color: 'white'}} hintText="Add a category"/><br />
                <RaisedButton
                    label="Add Category"
                    style={{margin: '0 auto'}}
                    id="addButton"
                    onClick={(e) => {
                        this.addCategory(e)
                    }} />
                <br/><br/>
                <RaisedButton
                    label="Delete Category"
                    style={{margin: '0 auto'}}
                    id="deleteButton"
                    onClick={(e) => {
                        this.showTrashes(e)
                    }}/>
            </div>
        );
    }
}

class MenuBase extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            visible: false
        };

        this.changeMenuVisibility = this.changeMenuVisibility.bind(this);
        this.toggleMenu = this.toggleMenu.bind(this);
        this.moveMenuIcon = this.moveMenuIcon.bind(this);
    }

    toggleMenu() {
        this.setState({
            visible: !this.state.visible
        });
        this.props.pageZoomedIn();
    }

    changeMenuVisibility(e) {
        this.moveMenuIcon();
        this.toggleMenu();
        e.stopPropagation();
    };

    moveMenuIcon() {
        if (!this.state.visible)
            document.getElementById("menuIcon").style.padding = "0px 0px 0px 270px";
        else
            document.getElementById("menuIcon").style.padding = "0px 0px 0px 0px";
    }

    render() {
        return (
            <div className="MenuIcon">
                <MenuIcon id="menuIcon" onClick={(e) => {this.changeMenuVisibility(e)}}/>
                <Menu menuVisibility={this.state.visible}
                      toggleMenu={this.toggleMenu.bind(this)}
                      moveMenuIcon={this.moveMenuIcon.bind(this)}
                      setCurrentCategories={this.props.setCurrentCategories.bind(this)}
                      setSelectedCategory={this.props.setSelectedCategory.bind(this)}/>
            </div>
        );
    }
}

export default MenuBase;