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
    this.setState = function (newState){
        this.done = newState
    }
}

class MaterialUIs extends Component {
    state = {
        data: [],
    };
    handleCheck(i){
        let state = this.state.data[i].getState();
        this.state.data[i].setState(!state);
        this.setState((oldState) => {
            return {
                checked: !oldState.checked,
            };
        });
        let selectedTask = this.state.data[i]

    }
    addTask = function (e) {
        let name = document.getElementById("taskName").value;
        let newTask = new Task(name, -1);
        this.setState({data : [...this.state.data, newTask]});
    };

    removeTask = function (e, i) {
        let selectedTask = this.state.data[i]
        this.setState(state => ({
            data: state.data.filter((x, j) => j !== i),
        }));
    };


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