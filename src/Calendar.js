import React from "react";
import './Styles/App.css';
import {MuiThemeProvider} from "material-ui";
import App from "./App";
import CalendarUI from "./CalendarUI";
import ModeButton from "./UI/ModeButton";

class Calendar extends React.Component{
    render() {
        return (
            <div className="Calendar">
                <MuiThemeProvider>
                    <div className="App">
                        <ModeButton
                            label="Home"
                            onClick={() => this.props.pager.push(App)}
                            side="left"
                        />
                        <CalendarUI/>
                    </div>
                </MuiThemeProvider>
            </div>
        );
    }
}
export default Calendar