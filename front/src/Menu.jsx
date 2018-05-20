import React, {Component} from 'react';
import MenuIcon from "material-ui/svg-icons/navigation/menu"
import ArrowIcon from "material-ui/svg-icons/navigation/arrow-back"
import './Styles/App.css'
import './Styles/Menu.css'
import {addCategoryRequest, getAllCategories, getSubcategories} from './Requests/Requests'
import {FloatingActionButton, RaisedButton, TextField} from "material-ui";
import Category from "./Category/Category";

class Menu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data : getAllCategories(),
            currentCategory: new Category("Base categories", 1, null),
            childrenCurrentCategory: getSubcategories(new Category("root", 1, null))
        };

        setTimeout(function() {
            let temp = this.state.data;
            temp.unshift(new Category("None", 1, null));
            this.props.setCurrentCategories(temp);
        }.bind(this), 1000);

    }

    filterBackwards(e){
        let currentCategoryID = this.state.currentCategory.getParentID();
        let currentCategory = new Category("Base categories", 1, null);
        let temp = new Category("None", 1, null);
        let categoriesToDisplayInTasks = [];

        if(currentCategoryID !== 1){
            for(let i = 0; i < this.state.data.length; i++){
                if(this.state.data[i].getID() === currentCategoryID){
                    currentCategory = this.state.data[i];
                    temp = this.state.data[i];
                    break;
                }
            }
        }
        categoriesToDisplayInTasks.push(temp);

        if (currentCategoryID === null){
            this.props.toggleMenu();
        } else {
            let categories = [];
            for(let i = 0; i < this.state.data.length; i++){
                if(this.state.data[i].getParentID() === currentCategoryID){
                    categories.push(this.state.data[i]);
                    categoriesToDisplayInTasks.push(this.state.data[i]);
                }
            }

            let j = 1;
            while(j !== categoriesToDisplayInTasks.length){
                let cID = categoriesToDisplayInTasks[j].getID();

                for(let k = 0; k < this.state.data.length; k++){
                    if(this.state.data[k].getParentID() === cID){
                        categoriesToDisplayInTasks.push(this.state.data[k]);
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
        e.stopPropagation();
    }

    filterCategories(e, i) {
        let categories = [];
        let categoriesToDisplayInTasks = [];
        let length = this.state.data.length;
        let currentCategory = this.state.childrenCurrentCategory[i];
        let currentCategoryID = currentCategory.getID();
        categoriesToDisplayInTasks.push(currentCategory);

        for(let j = 0; j < length; j++){
            if(this.state.data[j].getParentID() === currentCategoryID){
                categories.push(this.state.data[j]);
                categoriesToDisplayInTasks.push(this.state.data[j]);
            }
        }

        let j = 1;
        while(j !== categoriesToDisplayInTasks.length){
            let cID = categoriesToDisplayInTasks[j].getID();

            for(let k = 0; k < length; k++){
                if(this.state.data[k].getParentID() === cID){
                    categoriesToDisplayInTasks.push(this.state.data[k]);
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

    addCategory() {
        let name = document.getElementById("categoryName").value;
        console.log(name);

        if (name !== ""){
            let newTask = addCategoryRequest(name, this.state.parentCategory.getID());
            let temp = this.state.data;
            temp.push(newTask);
            this.setState({data : temp});
            document.getElementById('taskName').value = "";
            document.getElementById('taskName').hintText = "Add a category";
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
                           className="BackIcon" onClick={(e) => {this.filterBackwards(e)}}/>
                <h1 className="title">{this.state.currentCategory.getName()}</h1>
                {this.state.childrenCurrentCategory.map((object, index) =>
                    <li key={`item-${index}`}
                        onClick={(e) => { this.filterCategories(e, index) }}>
                        <h2>{object.getName()}</h2>
                    </li>)}
                <TextField id="categoryName" style={{margin: '0 8px'}} hintStyle={{color: '#bababa'}} inputStyle={{color: 'white'}} hintText="Add a category"/><br />
                {/*TODO change to FloatingActionButton*/}
                <RaisedButton
                    label="Add Category"
                    style={{margin: '0 auto'}}
                    id="addButton"
                    onClick={(e) => {
                        this.addCategory(e)
                    }} />
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

        this.showMenu = this.showMenu.bind(this);
        this.toggleMenu = this.toggleMenu.bind(this);
    }

    toggleMenu() {
        this.setState({
            visible: !this.state.visible
        });
        this.props.pageZoomedIn();
    }

    showMenu(e) {
        this.toggleMenu();

        e.stopPropagation();
    };

    render() {
        return (
            <div className="MenuIcon">
                <MenuIcon onClick={(e) => {this.showMenu(e)}}/>
                <Menu menuVisibility={this.state.visible}
                      toggleMenu={this.toggleMenu.bind(this)}
                      setCurrentCategories={this.props.setCurrentCategories.bind(this)}
                      setSelectedCategory={this.props.setSelectedCategory.bind(this)}/>
            </div>
        );
    }
}

export default MenuBase;