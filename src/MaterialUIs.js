import React, {Component} from 'react';
import {
    Table,
    TableBody,
    TableRow,
    TableRowColumn,
}
from 'material-ui/Table';
import {Checkbox, RaisedButton, TableHeaderColumn, TextField} from "material-ui";
import TrashIcon from "material-ui/svg-icons/action/delete";
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';
import './Styles/App.css';
import Task from "./Task/Task";
import Loader from "./Loader/Loader"
import {getStripedStyle} from "./Styles/Styling"
import {markRequest, addRequest, getAllTasks, deleteRequest, swapRequest} from "./Requests/Requests";


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

const SortableItem = SortableElement(({index, row, getIndex, removeTask, handleCheck}) =>
    <TableRow key={getIndex(row.getID())}
              style={{ padding: '5px 20px', height: 25, ...getStripedStyle(getIndex(row.getID())) }}>
        <TableRowColumn id="taskID">
            {row.getID()}
        </TableRowColumn>
        <TableRowColumn id="taskName">
            {row.getName()}
        </TableRowColumn>
        <TableRowColumn>
            <Checkbox id="taskStatus"
                checked={row.getState()}
                onCheck={() => handleCheck(getIndex(row.getID()))}
            />
        </TableRowColumn>
        <TableRowColumn>
            <TrashIcon id="trashIcon" onClick={(e) => { removeTask(e, getIndex(row.getID())) }}/>
        </TableRowColumn>
    </TableRow>);


const SortableTable = SortableContainer(({getData, getIndex, removeTask, handleCheck}) => {
    return (
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
                    <TableHeaderColumn>Name</TableHeaderColumn>
                    <TableHeaderColumn>Status</TableHeaderColumn>
                    <TableHeaderColumn>Delete</TableHeaderColumn>
                </TableRow>
                    {getData().map((value, index) => (
                        <SortableItem key={`item-${index}`} index={index} row={value}
                                      getIndex={getIndex} removeTask={removeTask} handleCheck={handleCheck}/>
                    ))}
            </TableBody>
        </Table>
    );
});



class MaterialUIs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loading: true
        };
        this.reloadPage = this.reloadPage.bind(this);
    }

    componentDidMount() {
        window.addEventListener('load', this.reloadPage);
        this.setState({loading: false});

    }


    reloadPage() {
        this.setState({loading: true});
        let tasks = getAllTasks();

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
        let selectedTask = this.state.data[i];
        markRequest(selectedTask);

    }


    addTask = function () {
        let name = document.getElementById("taskName").value;
        let newTask = new Task(name, -1);
        newTask.setState(false);
        newTask = addRequest(newTask);
        let temp = this.state.data;
        temp.unshift(newTask);
        this.setState({data : temp});
        document.getElementById('taskName').value = "";
        document.getElementById('taskName').hintText = "name";
    };


    removeTask = function (e, i) {
        let selectedTask = this.state.data[i];
        this.setState(state => ({
            data: state.data.filter((x, j) => j !== i),
        }));
        deleteRequest(selectedTask);
    };


    onSortEnd = ({oldIndex, newIndex}) => {
        if(oldIndex !== newIndex){
            let taskID = this.state.data[oldIndex].getID();
            if(oldIndex > newIndex){
                console.log(oldIndex + " " + newIndex);
                console.log(taskID + " " + this.state.data[newIndex].getID());
                swapRequest(taskID, this.state.data[newIndex].getID());
            } else {
                console.log(oldIndex + " " + newIndex);
                let newParentID = null;
                if(newIndex + 1 < this.state.data.length){
                    newParentID = this.state.data[newIndex+1].getID();
                }
                console.log(taskID + " " + newParentID);
                swapRequest(taskID, newParentID);
            }

            this.setState({
                data: arrayMove(this.state.data, oldIndex, newIndex),
            });
        }
    };


    getData = () => {
      return this.state.data;
    };


    getIndex = (id) => {
        let length = this.state.data.length;
        for (let i = 0; i < length; i++) {
            if(this.state.data[i].getID() === id){
                return i;
            }
        }
    };

    render() {
        return (
            <div>
                <h1 className="title"> New task </h1>
                <TextField id="taskName" hintText="name"/><br />
                <RaisedButton
                    label="Add task"
                    id="addButton"
                    onClick={(e) => {
                        this.addTask(e)
                    }}
                /><br/><br/>

                    <SortableTable getData={this.getData.bind(this)} getIndex={this.getIndex.bind(this)}
                                   removeTask={this.removeTask.bind(this)} handleCheck={this.handleCheck.bind(this)}
                                   onSortEnd={this.onSortEnd}/>
                <br/>
                {this.state.loading ? <Loader/> : <div></div>}

            </div>
        );

    }

}

export default MaterialUIs;