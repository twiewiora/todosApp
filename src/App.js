import React, { Component } from 'react';
import './App.css';
import TableEx from './TableExample';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';


class App extends Component {
    state = {
        data: []
    };

    render() {
        return (
            <div className="App">
                <h1 className="title"> New task </h1>
                <form>
                    <input type="text" id="taskName" placeholder="Name"/><br/>
                    <button onClick={(e) => {this.addTask(e)}}>Add</button><br/>
                </form>
                <MuiThemeProvider>
                    <div className="App">
                        <TableEx
                            data={this.state.data}
                        />
                    </div>
                </MuiThemeProvider>
            </div>
        );
    }

    addTask(e){
        let name = document.getElementById("taskName").value;

        this.setState({data : [...this.state.data, name]});
        e.preventDefault();
    }
}

export default App;
