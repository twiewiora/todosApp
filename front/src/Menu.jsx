import React, {Component} from 'react';
import MenuIcon from "material-ui/svg-icons/navigation/menu"
import ArrowIcon from "material-ui/svg-icons/navigation/arrow-back"
import './Styles/App.css'
import './Styles/Menu.css'
import {addCategoryRequest, addRequest, getAllCategories, getSubcategories} from './Requests/Requests'
import {RaisedButton, TextField} from "material-ui";
import Category from "./Category/Category";

class Menu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            parentCategory: new Category("root", 1, null),
            data : getAllCategories(),
            menuTitle: "Categories"
        };
    }

    hideMenu(e){
        if(this.state.menuTitle === "Categories"){
            this.props.toggleMenu();
        } else {
            this.setState({
                menuTitle: "Categories"
            });
            this.props.setDataWithCategory("root");
        }

        e.stopPropagation();
    }

    filterCategories(e, i) {
        console.log(this.state.data[i]);
        let categories = getSubcategories(this.state.data[i]);
        let parentCat = this.state.data[i];

        setTimeout(function() {
            this.setState({
                data: categories,
                parentCategory: parentCat,
                menuTitle: this.state.data[i].getName()
            });
        }.bind(this), 1000);

        this.props.setDataWithCategory(this.state.data[i])
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
                <ArrowIcon style={{ padding: '0px 20px'}}
                           className="BackIcon" onClick={(e) => {this.hideMenu(e)}}/>
                <h1 className="title">{this.state.menuTitle}</h1>
                {this.state.data.map((object, index) =>
                    <li key={`item-${index}`}
                        onClick={(e) => { this.filterCategories(e, index) }}>
                        <h2>{object.getName()}</h2>
                    </li>)}
                <TextField id="categoryName" hintText="Add a category"/><br />
                <RaisedButton
                    label="Add Category"
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
                      setDataWithCategory={this.props.setDataWithCategory.bind(this)}/>
            </div>
        );
    }
}

export default MenuBase;