import React, { Component } from 'react';
import './App.css';
import TableEx from './TableExample';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {RaisedButton, TextField} from "material-ui";

class App extends Component {
    state = {
        data: []
    };

    addTask = function (e) {
        let name = document.getElementById("taskName").value;

        this.setState({data : [...this.state.data, name]});
        e.preventDefault();
    }
    render() {
        return (
            <div className="App">
                <h1 className="title"> New task </h1>
                <MuiThemeProvider>
                    <TextField id="taskName" hintText="name"/><br />
                    <RaisedButton
                        label="Add task"
                        id="addButton"
                        onClick={(e) => { this.addTask(e) }}
                    />
                    <div className="App">
                        <TableEx
                            data={this.state.data}
                        />
                    </div>
                </MuiThemeProvider>
            </div>
        );
    }


}

export default App;
