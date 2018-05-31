import React, {Component} from 'react';
import MenuIcon from "material-ui/svg-icons/navigation/menu"
import ArrowIcon from "material-ui/svg-icons/navigation/arrow-back"
import './Styles/App.css'
import './Styles/Menu.css'
import TrashIcon from "material-ui/svg-icons/action/delete";
import {addCategoryRequest, deleteCategoryRequest, getAllCategories, getSubcategories, getRootCategory} from './Requests/Requests'
import {RaisedButton, TextField} from "material-ui";
import Category from "./Category/Category";

class Menu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            currentCategory: new Category("Base categories", 1, null),
            childrenCurrentCategory: [],
            trashesVisibility: false
        };

    }

    componentDidMount() {
        getAllCategories()
            .then(allCategories =>
            {
                this.setState({data: allCategories});
            }).then(
            () => getRootCategory()
            )
            .then(root => {
            return root.getID()
            }).then( (rootId) =>
                {
                    return rootId
                }
            )
            .then((rootId)=> getSubcategories(new Category("root", rootId, null)))
            .then(childrenCurrentCategory => {
                childrenCurrentCategory.unshift(new Category("None", 0, null));     //to display also tasks without assigned category
                console.log('Show categories', childrenCurrentCategory);
                this.setState({childrenCurrentCategory});
                this.props.setCurrentCategories(childrenCurrentCategory);
            });
    }

    filterBackwards(e){
        e.stopPropagation();

        getAllCategories()
            .then(data => this.setState({data: data}))
            .then( () => {
                console.log('getAllCategories', this.state.data)
            let currentCategoryID = this.state.currentCategory.getParentID();
            let currentCategory = new Category("Base categories", 1, null);
            let temp = new Category("None", 0, null);
            let categoriesToDisplayInTasks = [];

            console.log('currentCategory', currentCategory);
            console.log('currentCategoryID', currentCategoryID);



            if (currentCategoryID !== 1) {
                for (let i = 0; i < this.state.data.length; i++) {
                    console.log('state.data[', i, ']', this.state.data[i])
                    if (this.state.data[i].getID() === currentCategoryID) {
                        currentCategory = this.state.data[i];
                        temp = this.state.data[i];
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
                for (let i = 0; i < this.state.data.length; i++) {
                    if (this.state.data[i].getParentID() === currentCategoryID) {
                        categories.push(this.state.data[i]);
                        categoriesToDisplayInTasks.push(this.state.data[i]);
                    }
                }

                let j = 1;
                while (j !== categoriesToDisplayInTasks.length) {
                    let cID = categoriesToDisplayInTasks[j].getID();

                    for (let k = 0; k < this.state.data.length; k++) {
                        if (this.state.data[k].getParentID() === cID) {
                            categoriesToDisplayInTasks.push(this.state.data[k]);
                        }
                    }
                    j += 1;
                }

                this.setState({
                    currentCategory: currentCategory,
                    childrenCurrentCategory: categories
                });

                this.props.setCurrentCategoryField(currentCategory);
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
            let currentCategory;
            if(this.state.childrenCurrentCategory[0].getName() === "None"){
                currentCategory = this.state.childrenCurrentCategory[i+1];
            } else{
                currentCategory = this.state.childrenCurrentCategory[i];
            }
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

            this.props.setCurrentCategoryField(currentCategory);
            this.props.setCurrentCategories(categoriesToDisplayInTasks);
            this.props.setSelectedCategory(currentCategoryID);
        });
    }

    addCategory() {
        let name = document.getElementById("categoryName").value;
        console.log('addCategory, name',name);

        if (name !== ""){
                addCategoryRequest(name, this.state.currentCategory.getID())
                .then( newCategory =>
                this.setState({
                    childrenCurrentCategory: [...this.state.childrenCurrentCategory, newCategory]
                }))
                .then(()=> {
                        console.log('addCategory, childrenCurrentCategory',this.state.childrenCurrentCategory);
                        document.getElementById("categoryName").value = "";
                        document.getElementById("categoryName").hintText = "Add a category"
                    }
                )
        }

    }

    deleteCategory(object, index) {
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

    handleKeyPress(event) {
        if (event.key === 'Enter') {
            this.addCategory(event);
        }
    }

    render() {
        let visibility = "hide";

        if (this.props.menuVisibility) {
            visibility = "show";
        }

        return (
            <div id="flyoutMenu" className={visibility}> <br/>
                <ArrowIcon style={{ padding: '0px 20px', color: 'white'}}
                           className="BackIcon" onClick={(e) => { this.filterBackwards(e)}}/>
                <h1 className="title">{this.state.currentCategory.getName()}</h1>
                {this.state.childrenCurrentCategory.filter(cat => cat.getName() !== "None").map((object, index) =>
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
                <TextField id="categoryName" style={{margin: '0 8px'}} hintStyle={{color: '#bababa'}}
                           inputStyle={{color: 'white'}} hintText="Add a category"
                           onKeyPress={(e) => {this.handleKeyPress(e)}}/><br />
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

        this.showOrHideMenu = this.showOrHideMenu.bind(this);
        this.toggleMenu = this.toggleMenu.bind(this);
        this.moveMenuIcon = this.moveMenuIcon.bind(this);
        this.setCurrentCategoryField = this.setCurrentCategoryField.bind(this);
    }

    toggleMenu() {
        this.setState({
            visible: !this.state.visible
        });
        this.props.pageZoomedIn();
    }

    showOrHideMenu(e) {
        this.moveMenuIcon();
        this.toggleMenu();
        this.showOrHideCategoryName();
        e.stopPropagation();
    };

    moveMenuIcon() {
        if (!this.state.visible)
            document.getElementById("menuIcon").style.paddingLeft = "270px";
        else
            document.getElementById("menuIcon").style.paddingLeft = "0px";
    };

    showOrHideCategoryName() {
        let field = document.getElementById("currentCategoryField");
        if (this.state.visible) {
            field.style.display = "inline";
        } else {
            field.style.display = "none";
        }
    };

    setCurrentCategoryField(current){
        if(current.getParentID() == null)
            document.getElementById("currentCategoryField").textContent = "";
        else
            document.getElementById("currentCategoryField").textContent = current.getName();
    };

    render() {
        return (
            <div className="MenuIcon">
                <p>
                    <MenuIcon id="menuIcon" onClick={(e) => {this.showOrHideMenu(e)}}/>
                    <text style={{padding: '0px 6px'}} id="currentCategoryField"></text>
                </p>
                <Menu menuVisibility={this.state.visible}
                      toggleMenu={this.toggleMenu.bind(this)}
                      moveMenuIcon={this.moveMenuIcon.bind(this)}
                      setCurrentCategoryField={this.setCurrentCategoryField.bind(this)}
                      setCurrentCategories={this.props.setCurrentCategories.bind(this)}
                      setSelectedCategory={this.props.setSelectedCategory.bind(this)}
                />
            </div>
        );
    }
}

export default MenuBase;