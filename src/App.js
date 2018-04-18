import React, { Component } from 'react';
import './Styles/App.css';
import MaterialAll from './MaterialUIs';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

class App extends Component {
    render() {
        return (
            <div className="App">
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
