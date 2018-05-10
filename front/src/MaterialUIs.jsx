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
import Loader from "./Loader/Loader"
import {getStripedStyle} from "./Styles/Styling"
import {markRequest, markAndDropRequest, addRequest, getAllTasks, deleteRequest, swapRequest} from "./Requests/Requests";
import {getMainStateTable} from "./Styles/TablesStates";


const SortableItem = SortableElement(({index, row, getIndex, removeTask, handleCheck}) =>
    <TableRow key={getIndex(row.getID())}
              style={{ padding: '5px 20px', height: 25, background : getStripedStyle(index, row.getState()) }}>
        <TableRowColumn style={{ width: "10%" }}>
            <Checkbox id="taskStatus"
                checked={row.getState()}
                onCheck={() => handleCheck(getIndex(row.getID()))}
            />
        </TableRowColumn>
        <TableRowColumn id="taskName">
            {row.getName()}
        </TableRowColumn>
        <TableRowColumn style={{ width: "10%" }}>
            <TrashIcon id="trashIcon" onClick={(e) => { removeTask(e, getIndex(row.getID())) }}/>
        </TableRowColumn>
    </TableRow>);


const SortableTable = SortableContainer(({getData, getIndex, removeTask, handleCheck}) => {
    return (
        <Table
            fixedHeader={getMainStateTable().fixedHeader}
            fixedFooter={getMainStateTable().fixedFooter}
            selectable={getMainStateTable().selectable}
            multiSelectable={getMainStateTable().multiSelectable}
            style={{ tableLayout: "auto" }}
        >
            <TableBody
                displayRowCheckbox={getMainStateTable().showCheckboxes}
                deselectOnClickaway={getMainStateTable().deselectOnClickaway}
                showRowHover={getMainStateTable().showRowHover}
                stripedRows={getMainStateTable().stripedRows}
            >
                <TableRow style ={{ background: '#ccccff' , padding: '5px 20px', height: 10}} >
                    <TableHeaderColumn>Status</TableHeaderColumn>
                    <TableHeaderColumn>Name</TableHeaderColumn>
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
        this.handleKeyPress = this.handleKeyPress.bind(this)
    }

    componentWillMount() {
        this.reloadPage();

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



    handleKeyPress(event) {
        if (event.key === 'Enter') {
            this.addTask();
        }
    }

     handleCheck(i){
        let state = this.state.data[i].getState();
        let firstDoneIndex = this.getFirstDoneTaskIndex();

        let selectedTask = this.state.data[i];
        this.state.data[i].setState(!state);

        this.setState((oldState) => {
            return {
                checked: !oldState.checked,
                color: !oldState.checked === true ? 'grey' : 'white'
            };
        });

         if(firstDoneIndex !== 1 || firstDoneIndex !== 0){
             if(!(this.state.data[i].getState() && i === firstDoneIndex-1)
                 && !(!this.state.data[i].getState() && i <= firstDoneIndex)) {
                 if(i > firstDoneIndex){
                     this.setState({
                         data: arrayMove(this.state.data, i, firstDoneIndex),
                     });
                 } else {
                     this.setState({
                         data: arrayMove(this.state.data, i, firstDoneIndex - 1),
                     });
                 }
                 console.log(firstDoneIndex-1);
                 markAndDropRequest(selectedTask, this.state.data[firstDoneIndex-1]);
             } else {
                 markRequest(selectedTask);
             }
         }

    }


    addTask = function () {
        let name = document.getElementById("taskName").value;
        if (name !== ""){
            let newTask = addRequest(name);
            let temp = this.state.data;
            temp.unshift(newTask);
            this.setState({data : temp});
            document.getElementById('taskName').value = "";
            document.getElementById('taskName').hintText = "name";
        }
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
                let newParentID = null;
                if(newIndex - 1 >= 0){
                    newParentID = this.state.data[newIndex-1].getID();
                }
                swapRequest(taskID, newParentID);
            } else {
                swapRequest(taskID, this.state.data[newIndex].getID());
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

    getFirstDoneTaskIndex = function () {
        let length = this.state.data.length;
        let firstDoneTaskIndexAtTheBottom = length;
        for (let i = length-1; i >= 0; i--){
            if(this.state.data[i].getState() === false) {
                break;
            } else {
                firstDoneTaskIndexAtTheBottom = i;
            }
        }
        return firstDoneTaskIndexAtTheBottom;
    };
    render() {
        return (
            <div>
                <h1 className="title"> New task </h1>
                <TextField id="taskName" hintText="name" onKeyPress={this.handleKeyPress} /><br />
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
                {this.state.loading? <Loader/> : <div></div>}
            </div>
        );
    }

}

export default MaterialUIs;