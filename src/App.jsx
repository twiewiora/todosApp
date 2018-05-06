import React from 'react';
import './Styles/App.css';
import MaterialAll from './MaterialUIs';
import MenuBase from './Menu'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Calendar from "./Calendar";
import ModeButton from "./UI/ModeButton";

const App = (props) =>
    <div className="App">
        <MuiThemeProvider>
            <div className="App">
                <MenuBase/>
                <ModeButton label="Calendar Mode" onClick={() => props.pager.push(Calendar)} />
                <MaterialAll/>
            </div>
        </MuiThemeProvider>
    </div>


export default App;
