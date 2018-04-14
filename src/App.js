import React, { Component } from 'react';
import './App.css';
import MaterialAll from './MaterialUIs';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

class App extends Component {
    render() {
        return (
            <div className="App">
                <h1 className="title"> New task </h1>
                <MuiThemeProvider>
                    <div className="App">
                        <MaterialAll/>
                    </div>
                </MuiThemeProvider>
            </div>
        );
    }


}

export default App;
