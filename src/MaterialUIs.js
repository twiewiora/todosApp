import React, {Component} from 'react';
import {
    Table,
    TableBody,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';
import {Checkbox, RaisedButton, TableHeaderColumn, TextField} from "material-ui";
import TrashIcon from "material-ui/svg-icons/action/delete"
import './App.css';

const stateTable = {
    fixedHeader: true,
    fixedFooter: true,
    stripedRows: false,
    showRowHover: false,
    selectable: true,
    multiSelectable: true,
    enableSelectAll: true,
    deselectOnClickaway: false,
    showCheckboxes: false,
    height: '300px',
};




function Task(name, id) {
    this.name = name;
    this.done = false;
    this.id = id;

    this.getState = function () {
        return this.done
    };
    this.getName = function () {
        return this.name
    };
    this.getID = function () {
        return this.id
    };
    this.setID = function (id) {
        this.id = id;
    };
    this.setState = function (newState){
        this.done = newState
    }
}

class MaterialUIs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
        };
        this.reloadPage = this.reloadPage.bind(this);
    }
    componentDidMount() {
        window.addEventListener('load', this.reloadPage);

    }
    reloadPage() {
        let tasks = [];
        fetch('http://localhost:3001/tasks')
            .then(res => {
                return res.json();
            })
            .then(data => {
                console.log(data);
                for (let i = 0; i < data.length; i++){
                    let newTask = new Task(data[i].title, data[i].id);
                    newTask.setState(data[i].done);

                    tasks.unshift(newTask);
                }
            });
        this.setState({
            loading: true
        }, function(){
            setTimeout(function() {
                this.setState({
                    data: tasks,
                    loading: false
                });
            }.bind(this), 3000)
        }.bind(this));

    }
    handleCheck(i){
        let state = this.state.data[i].getState();
        this.state.data[i].setState(!state);
        this.setState((oldState) => {
            return {
                checked: !oldState.checked,
            };
        });
        let selectedTask = this.state.data[i]
        console.log(selectedTask);
        this.markRequest(selectedTask);

    }

    markRequest(selectedTask) { // works bad on test serwer, should work good on real server
       var data = new URLSearchParams("title=" + selectedTask.getName() + "&done="+ selectedTask.getState());
        console.log(data);
        fetch('http://localhost:3001/tasks/' + selectedTask.getID(), { method: 'PUT', body: data})
            .then(res => {
                console.log(res);
                return res.json();
            })
            .then(data => {
                console.log(data);
            });

    }
    addTask = function (e) {
        let name = document.getElementById("taskName").value;
        let newTask = new Task(name, -1);
        newTask.setState(false);
        this.addRequest(newTask);

        console.log("DATA");
        console.log(this.state.data);
        window.location.reload();
    };

    addRequest(newTask) {
        console.log("json");

        var data = new URLSearchParams("title=" + newTask.getName());
        console.log(data);
        fetch('http://localhost:3001/tasks', { method: 'POST', body: data})
            .then(res => {
                return res.json();
            })
            .then(data => {
                newTask.setID(data.id);
                newTask.setState(data.done);
                this.setState({data : [...this.state.data, newTask]});
                console.log(data);
                console.log(newTask);
            });
    }

    removeTask = function (e, i) {
        let selectedTask = this.state.data[i]
        this.setState(state => ({
            data: state.data.filter((x, j) => j !== i),
        }));
        this.deleteRequest(selectedTask);
    };

    deleteRequest(selectedTask) {
        var data = new URLSearchParams("/" + selectedTask.getID());
        console.log(data);
        fetch('http://localhost:3001/tasks/' + selectedTask.getID(), { method: 'DELETE'})
           .then(res => {
               console.log(res);
               return res.json();
           })
           .then(data => {
               console.log(data);
           });
    }


    getStripedStyle = function(index) {
        return { background: index % 2 ? '#e6e6ff' : 'white' };
    };


    render() {
        return (
            <div>
                <TextField id="taskName" hintText="name"/><br />
                <RaisedButton
                    label="Add task"
                    id="addButton"
                    onClick={(e) => { this.addTask(e) }}
                /><br />
                <Table
                    fixedHeader={stateTable.fixedHeader}
                    fixedFooter={stateTable.fixedFooter}
                    selectable={stateTable.selectable}
                    multiSelectable={stateTable.multiSelectable}
                >
                    <TableBody
                        displayRowCheckbox={stateTable.showCheckboxes}
                        deselectOnClickaway={stateTable.deselectOnClickaway}
                        showRowHover={stateTable.showRowHover}
                        stripedRows={stateTable.stripedRows}
                    >
                        <TableRow style ={{ background: '#ccccff' , padding: '5px 20px', height: 10}} >
                            <TableHeaderColumn>ID</TableHeaderColumn>
                            <TableHeaderColumn>Name</TableHeaderColumn>
                            <TableHeaderColumn>Status</TableHeaderColumn>
                            <TableHeaderColumn>Delete</TableHeaderColumn>
                        </TableRow>

                        {this.state.data.map((row, i) =>
                            <TableRow key={i}
                                      style={{ padding: '5px 20px', height: 25, ...this.getStripedStyle(i) }}>
                                <TableRowColumn>
                                    {row.getID()}
                                </TableRowColumn>
                                <TableRowColumn>
                                    {row.getName()}
                                </TableRowColumn>
                                <TableRowColumn>
                                    <Checkbox
                                        checked={this.state.data[i].getState()}
                                        onCheck={() => this.handleCheck(i)}
                                    />
                                </TableRowColumn>
                                <TableRowColumn>
                                    <TrashIcon onClick={(e) => { this.removeTask(e, i) }}/>
                                </TableRowColumn>
                            </TableRow>)}
                    </TableBody>
                </Table>
            </div>
        );
    }

}

export default MaterialUIs;