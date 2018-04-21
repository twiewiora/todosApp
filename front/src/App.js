import React, { Component } from 'react';
import './Styles/App.css';
import MaterialAll from './MaterialUIs';
import MenuBase from './Menu'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

class App extends Component {
    render() {
        return (
            <div className="App">
                <MuiThemeProvider>
                    <div className="App">
                        <MenuBase/>
                        <MaterialAll/>
                    </div>
                </MuiThemeProvider>
            </div>
        );
    }


}

export default App;
