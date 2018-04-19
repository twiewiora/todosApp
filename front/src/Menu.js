import React, {Component} from 'react';
import MenuIcon from "material-ui/svg-icons/navigation/menu"
import './Styles/App.css'

class MenuBase extends Component {
    showMenu = function () {
       alert("In second iteration the menu will show here.")
    };

    render() {
        return (
            <div className="MenuIcon">
                <MenuIcon onClick={(e) => {this.showMenu(e)}}/>
            </div>
        );
    }
}

export default MenuBase;