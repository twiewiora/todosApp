import React, { Component } from 'react';
import './Styles/App.css';
import MaterialAll from './MaterialUIs';
import MenuBase from './Menu'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {FontIcon, RaisedButton} from "material-ui";
import Calendar from "./Calendar";

const App = (props) =>
    <div className="App">
                <MuiThemeProvider>
                    <div className="App">
                        <MenuBase/>
                        <RaisedButton className="calendarButton"
                            target="_blank"
                            label="Calendar Mode"
                            onClick={e=>props.pager.push(Calendar)}
                        />
                        <MaterialAll/>
                    </div>
                </MuiThemeProvider>
            </div>


export default App;
