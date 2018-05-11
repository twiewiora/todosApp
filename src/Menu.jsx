import React, {Component} from 'react';
import MenuIcon from "material-ui/svg-icons/navigation/menu"
import ArrowIcon from "material-ui/svg-icons/navigation/arrow-back"
import './Styles/App.css'
import './Styles/Menu.css'
import {getAllCategories} from './Requests/Requests'

class Menu extends Component {
    constructor(props) {
        super(props);

        this.state = { data : getAllCategories() };
    }

    hideMenu(e){
        this.props.toggleMenu();
        this.props.setDataWithCategory("root");
        e.stopPropagation();
    }

    filterCategories(e, i) {
        console.log(this.state.data[i]);

        this.props.setDataWithCategory(this.state.data[i])
    }

    render() {
        let visibility = "hide";

        if (this.props.menuVisibility) {
            visibility = "show";
        }

        return (
            <div id="flyoutMenu"
                 className={visibility}> <br/>
                <ArrowIcon className="BackIcon" onClick={(e) => {this.hideMenu(e)}}/>
                {this.state.data.map((object, index) =>
                    <li key={`item-${index}`}
                        onClick={(e) => { this.filterCategories(e, index) }}>
                        <h2>{object.getName()}</h2>
                    </li>)}
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