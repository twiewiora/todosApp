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
import {arrayMove} from 'react-sortable-hoc';
import './Styles/App.css';
import Loader from "./Loader/Loader"
import {swapRequest} from "./Requests/Requests";
import {getMainStateTable} from "./Styles/TablesStates";
import {singleDate} from "./Utils/DateFunctions";

import SortableTable from "./UI/SortableTable"



class MaterialUIs extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
        }

        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleKeyPressAtCategory = this.handleKeyPressAtCategory.bind(this);
    }

   handleKeyPress(event) {

        if (event.key === 'Enter') {
            this.props.addTask(this.state.name);
            this.setState({name: ''});
            event.target.hintText = 'Add Task';
            event.target.value = '';
        }
    }

    handleChange = event => {
        this.setState({ name: event.target.value });
    };

    handleKeyPressAtCategory(event, categoryId) {
        if (event.key === 'Enter') {
            this.props.addTaskWithCategory(event, categoryId, this.state.name);
            this.setState({name: ''});
            event.target.hintText = 'Add Task';
            event.target.value = '';
        }
    }

    containsCategoryToDisplay(categoryName) {
        for(let i = 0; i < this.props.categoriesToDisplay.length; i++){
            if(this.props.categoriesToDisplay[i].getName() === categoryName){
                return true;
            }
        }
        return false;
    }

    onSortEnd = ({oldIndex, newIndex}) => {
        let data = this.props.getData();
        if(oldIndex !== newIndex){
            let taskID = data[oldIndex].getID();
            if(oldIndex > newIndex){
                let newParentID = null;
                if(newIndex - 1 >= 0){
                    newParentID = data[newIndex-1].getID();
                }
                swapRequest(taskID, newParentID);
            } else {
                swapRequest(taskID, data[newIndex].getID());
            }

            this.props.setData(arrayMove(this.props.getData(), oldIndex, newIndex));
        }
    };

    filterData() {

        return this.props.getData().filter(task => this.containsCategoryToDisplay(task.getCategoryName()))
    }

    render() {
        if(this.props.ifSetDragnDrop){
            return (
                <div>
                    <h1 className="title" style={{fontFamily: 'Lobster'} }> Your notepad </h1>
                    <TextField id="taskName" floatingLabelText="Add Task" value={this.state.name}
                               onKeyPress={this.handleKeyPress} onChange={this.handleChange} /><br/>

                    <div className="topBarMenu">
                        <RaisedButton
                            label="Add task"
                            id="addButton"
                            className="addButton"
                            onClick={(e) => {
                                this.props.addTask(this.state.name);
                                this.setState({name: ''});
                                e.target.hintText = 'Add Task';
                                e.target.value = '';
                            }}
                        />
                        <RaisedButton
                            label="Edit tasks"
                            id="editButton"
                            className="editButton"
                            onClick={(e) => {
                                this.props.toggleEditTask(e)
                            }}
                            side="right"
                        />
                    </div><br/><br/>
                    <SortableTable getData={this.props.getData.bind(this)}
                                   getIndex={this.props.getIndex.bind(this)}
                                   removeTask={this.props.removeTask.bind(this)}
                                   handleCheck={this.props.handleCheck.bind(this)}
                                   onSortEnd={this.onSortEnd}
                                   getEditVisibility={this.props.getEditVisibility.bind(this)}
                                   openEditWindow={this.props.open}
                                   editTask={this.props.editTask.bind(this)}
                    />
                    <br/>
                    {this.props.appLoading ? <Loader/> : <div></div>}
                </div>
            );
        } else{
            return (
                <div>
                    <h1 className="title" style={{fontFamily: 'Lobster'} }> Your notepad </h1>

                    <TextField id="taskName" floatingLabelText="Add Task" value={this.state.name}
                               onKeyPress={(e) => {this.handleKeyPressAtCategory(e, this.props.currentCategoryId)}}
                               onChange={this.handleChange} /><br/>
                    <div className="topBarMenu">
                    <RaisedButton
                        label="Add task"
                        id="addButton"
                        className="addButton"
                        onClick={(e) => {
                            this.props.addTaskWithCategory(e, this.props.currentCategoryId, this.state.name);
                            this.setState({name: ''});
                            e.target.hintText = 'Add Task';
                            e.target.value = '';
                        }}
                    />
                    </div><br/><br/>
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
                            <TableRow style ={{ background: '#354778',  padding: '5px 20px', height: 10}} >
                                <TableHeaderColumn>Status</TableHeaderColumn>
                                <TableHeaderColumn>Name</TableHeaderColumn>
                                <TableHeaderColumn>Category</TableHeaderColumn>
                                <TableHeaderColumn>Date</TableHeaderColumn>
                                <TableHeaderColumn>Delete</TableHeaderColumn>
                            </TableRow>
                            {this.filterData().map((value, index) => (
                                <TableRow key={index}
                                          style={{ padding: '5px 20px', height: 25}}>
                                    <TableRowColumn style={{ width: "10%" }}>
                                        <Checkbox id="taskStatus"
                                                  checked={value.getState()}
                                                  onCheck={() => this.props.handleCheck(value.getID())}
                                        />
                                    </TableRowColumn>
                                    <TableRowColumn id="taskName">
                                        {value.getName()}
                                    </TableRowColumn>
                                    <TableRowColumn style={{ width: "10%" }}>
                                        {value.getCategoryName()}
                                    </TableRowColumn>
                                    <TableRowColumn style={{ width: "10%" }}>
                                        { value.getDate() == null ? "Unassigned" : singleDate(value.getDate())}
                                    </TableRowColumn>
                                    <TableRowColumn style={{ width: "10%" }}>
                                        <TrashIcon id="trashIcon" onClick={(e) => { this.props.removeTask(e, value.getID()) }}/>
                                    </TableRowColumn>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <br/>
                    {this.props.appLoading? <Loader/> : <div></div>}
                </div>
            );
        }
    }
}

export default MaterialUIs;

/** return this.state.data.filter(task => this.containsCategoryToDisplay(task.getCategoryName()));
 {this.props.getData().filter(task => this.containsCategoryToDisplay(task.getCategoryName())).map((value, index) => ( **/