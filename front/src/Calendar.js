import * as React from "react/cjs/react.development";
import './Styles/App.css';
import {MuiThemeProvider, RaisedButton} from "material-ui";
import App from "./App";
import CalendarUI from "./CalendarUI";

class Calendar extends React.Component{
    render() {
        return (
            <div className="Calendar">
                <MuiThemeProvider>
                    <div className="App">
                        <RaisedButton className="homeButton"
                                      target="_blank"
                                      label="Home"
                                      onClick={e=>{this.props.pager.push(App)}}
                        />
                    </div>
                    <CalendarUI/>
                </MuiThemeProvider>
            </div>
        );
    }
}
export default Calendar