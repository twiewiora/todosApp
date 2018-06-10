import React, {Component} from 'react';
import {createFilter} from 'react-search-input'
import {
    Table,
    TableBody,
    TableRow,
    TableRowColumn,
}
from 'material-ui/Table';
import IconButton from '@material-ui/core/IconButton'
import {Checkbox, FloatingActionButton, TableHeaderColumn, TextField} from "material-ui";
import TrashIcon from "material-ui/svg-icons/action/delete";
import EditIcon from "material-ui/svg-icons/image/edit";
import {arrayMove} from 'react-sortable-hoc';
import './Styles/App.css';
import Loader from "./Loader/Loader"
import {getStripedStyle, setTrashIconColor} from "./Styles/Styling"
import {swapRequest} from "./Requests/Requests";
import {getMainStateTable} from "./Styles/TablesStates";
import {singleDate} from "./Utils/DateFunctions";
import ContentAdd from 'material-ui/svg-icons/content/add';
import SortableTable from "./UI/SortableTable"

const KEYS_TO_FILTERS = ['name'];

class MaterialUIs extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
        }

        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleKeyPressAtCategory = this.handleKeyPressAtCategory.bind(this);
        this.handleSearching = this.handleSearching.bind(this);
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

    handleSearching(event) {

            this.props.searchUpdated();
    }

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

    filterDataByCategory() {

        return this.filterDataByTitle().filter(task => this.containsCategoryToDisplay(task.getCategoryName()))
    }

    filterDataByTitle() {
        return this.props.getData().filter(createFilter(this.props.searchTerm, KEYS_TO_FILTERS));
    }

    render() {
        if(this.props.ifSetDragnDrop){
            return (
                <div>
                    <h1 className="title" style={{fontFamily: 'Lobster'} }> Your notepad </h1>
                    <div className='addTaskPanel'>
                            <TextField id="taskName" className="addTextField"
                                                                       floatingLabelText="Add Task"
                                                                       value={this.state.name}
                                                                       onKeyPress={this.handleKeyPress}
                                                                       onChange={this.handleChange}/><br/>
                            <FloatingActionButton mini={true}
                                                  onClick={(e) => {
                                                      this.props.addTaskWithCategory(e, this.props.currentCategoryId, this.state.name);
                                                      this.setState({name: ''});
                                                      e.target.hintText = 'Add Task';
                                                      e.target.value = '';
                                                  }}>
                                <ContentAdd/>
                            </FloatingActionButton>
                    </div>
                    <div className="taskViewPanel">
                        <TextField type="text" id="searcher"
                                   floatingLabelText="Search"
                                   onChange={this.handleSearching}/>

                        <FloatingActionButton mini={true}
                                              secondary={this.props.deleteVisibility}
                                              onClick={(e) => {
                                                  this.props.toggleDeleteTask(e);
                                              }}>
                            <TrashIcon id="trashIcon"
                                       style={{cursor: "pointer"}}/>

                        </FloatingActionButton>

                        <FloatingActionButton mini={true}
                                              secondary={this.props.editVisibility}
                                              onClick={(e) => {
                                                  this.props.toggleEditTask(e);
                                              }}>
                            <EditIcon id="editTaskIcon" style={{cursor: "pointer"}} />
                        </FloatingActionButton>
                    </div>
                    <br/><br/>
                    <SortableTable
                          pressDelay={200}
                                   getData={this.filterDataByTitle()}
                                   getIndex={this.props.getIndex.bind(this)}
                                   removeTask={this.props.removeTask.bind(this)}
                                   handleCheck={this.props.handleCheck.bind(this)}
                                   onSortEnd={this.onSortEnd}
                                   getEditVisibility={this.props.getEditVisibility.bind(this)}
                                   getDeleteVisibility={this.props.getDeleteVisibility.bind(this)}
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

                    <div className='addTaskPanel'>
                        <TextField id="taskName" className="addTextField" floatingLabelText="Add Task"
                                   value={this.state.name}
                                   onKeyPress={(e) => {this.handleKeyPressAtCategory(e, this.props.currentCategoryId)}}
                                   onChange={this.handleChange}/><br/>
                        <FloatingActionButton mini={true}
                                              onClick={(e) => {
                                                  this.props.addTaskWithCategory(e, this.props.currentCategoryId, this.state.name);
                                                  this.setState({name: ''});
                                                  e.target.hintText = 'Add Task';
                                                  e.target.value = '';
                                              }}>
                            <ContentAdd />
                        </FloatingActionButton>
                    </div>

                    <div className="taskViewPanel">
                        <TextField type="text" id="searcher"
                                   floatingLabelText="Search"
                                   onChange={this.handleSearching}/>
                        <FloatingActionButton mini={true}
                                              secondary={this.props.deleteVisibility}
                                              onClick={(e) => {
                                                  this.props.toggleDeleteTask(e);
                                              }}>
                            <TrashIcon/>

                        </FloatingActionButton>

                        <FloatingActionButton mini={true}
                                              secondary={this.props.editVisibility}
                                              onClick={(e) => {
                                                  this.props.addTaskWithCategory(e, this.props.currentCategoryId, this.state.name);
                                                  this.setState({name: ''});
                                                  e.target.hintText = 'Add Task';
                                                  e.target.value = '';
                                              }}>
                            <EditIcon id="editTaskIcon" style={{cursor: "pointer"}} onClick={(e) => {
                                this.props.toggleEditTask(e);
                            }}/>
                        </FloatingActionButton>
                    </div>

                    <br/><br/>
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
                                {
                                    this.props.getEditVisibility()
                                        ? (<TableHeaderColumn>Edit</TableHeaderColumn>)
                                        : null
                                }
                                <TableHeaderColumn>Status</TableHeaderColumn>
                                <TableHeaderColumn>Name</TableHeaderColumn>
                                <TableHeaderColumn>Category</TableHeaderColumn>
                                <TableHeaderColumn>Date</TableHeaderColumn>
                                {
                                    this.props.getDeleteVisibility()
                                        ? (<TableHeaderColumn>Delete</TableHeaderColumn>)
                                        : null
                                }
                            </TableRow>
                            {this.filterDataByCategory().map((value, index) => (
                                <TableRow key={index}
                                          style={{ padding: '5px 20px', height: 25}}>
                                    {
                                        this.props.getEditVisibility()
                                            ? (<TableRowColumn style={{ width: "10%" }}>
                                                <EditIcon id="editTaskIcon" style={{cursor: "pointer"}}
                                                          onClick={(e) => { this.props.editTask(e, value) }}/>
                                            </TableRowColumn>)
                                            : null
                                    }
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
                                    {
                                        this.props.getDeleteVisibility()
                                            ? (<TableRowColumn style={{ width: "10%" }}>
                                                <TrashIcon id="trashIcon" onClick={(e) => { this.props.removeTask(e, value.getID()) }}
                                                           style={{color: setTrashIconColor(index, value.getState() ), cursor: "pointer"}}/>
                                            </TableRowColumn>)
                                            : null
                                    }
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
