import React, { Component } from 'react';
import './App.css';


class App extends Component {
    render() {
        return (
            <div className="App">
                <h1 className="title"> New task </h1>
                <form>
                    <input type="text" id="taskName" placeholder="Name"/><br/>
                    <button onClick={(e) => {this.addTask(e)}}>Add</button><br/>
                </form>
                <table className="center" id="myTable">
                    <tr>
                        <th>Name</th>
                    </tr>
                </table>
            </div>
        );
    }

    addTask(e){
        let table = document.getElementById("myTable");
        let name = document.getElementById("taskName").value;
        let row = table.insertRow(table.rows.length);

        let cell1 = row.insertCell(0);

        cell1.innerHTML = name;
        e.preventDefault();
    }
}

export default App;
