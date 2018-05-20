import React, {Component} from "react";
import './Styles/App.css';
import {
    Checkbox,
    IconButton,
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn
} from "material-ui";

import TrashIcon from "material-ui/svg-icons/action/delete";
import PreviousDayIcon from "material-ui/svg-icons/av/fast-rewind";
import NextDayIcon from "material-ui/svg-icons/av/fast-forward";
import NextWeekIcon from "material-ui/svg-icons/av/skip-next";
import PreviousWeekIcon from "material-ui/svg-icons/av/skip-previous";
import AssignIcon from "material-ui/svg-icons/communication/call-made";
import UnassignIcon from "material-ui/svg-icons/communication/call-received";
import {
    assignToDate,
    getUnassignedTasks,
    getDailyTasks,
    markRequest,
    deleteRequest,
    unassignFromDate
} from "./Requests/Requests";
import Loader from "./Loader/Loader";
import {getRowStatusStyle} from "./Styles/Styling";
import {removeIndex} from "./Utils/ArrayFunctions";
import {dateFormat} from "./Utils/DateFunctions";
import {getCalendarDayStateTable, getUnassignedStateTable} from "./Styles/TablesStates";


class CalendarUI extends Component {
    constructor(props) {
        super(props);

        const today = new Date();

        this.state = {
            data: [],
            unassigned: [],
            loading: true,
            currentDateObject: today,
            currentDateTitle: dateFormat(today),
        };
    };

    componentWillMount() {
        this.reloadPage();
    }

    reloadPage = () => {
        this.setState({loading: true});
        let unassignedTasks = getUnassignedTasks();
        let dailyTasks = getDailyTasks(this.state.currentDateTitle);
        this.setState({
            loading: true
        },() => {
            setTimeout(() => {
                this.setState({
                    data: dailyTasks,
                    unassigned: unassignedTasks,
                    loading: false
                });
            }, 2000)
        });

    };
    reloadTasks(date){
        let dateDescription = dateFormat(date);
        let dailyTasks = getDailyTasks(dateDescription);
        this.setState({
            loading: true,
            currentDateObject: date,
            currentDateTitle: dateDescription,
        },() => {
            setTimeout(() => {
                this.setState({
                    data: dailyTasks,
                    loading: false
                });
            }, 2000)
        });
    }
    previousDay = () => {
        let newDate = this.state.currentDateObject;
        newDate.setDate(newDate.getDate()-1);
        this.reloadTasks(newDate);
    };

    nextDay = () => {
        let newDate = this.state.currentDateObject;
        newDate.setDate(newDate.getDate()+1);
        this.reloadTasks(newDate);
    };

    previousWeek() {
        let newDate = this.state.currentDateObject;
        newDate.setDate(newDate.getDate()-7);
        this.reloadTasks(newDate);
    };

    nextWeek() {
        let newDate = this.state.currentDateObject;
        newDate.setDate(newDate.getDate()+7);
        this.reloadTasks(newDate);
    };

    assignDate = (index) => {
        let selectedTask = this.state.unassigned[index];
        selectedTask.setDate(this.state.currentDateTitle);

        let newUnassigned = this.state.unassigned.slice();
        newUnassigned = removeIndex(newUnassigned, index);
        console.log(newUnassigned);

        let newData = this.state.data.slice();
        newData.push(selectedTask);
        assignToDate(selectedTask);
        console.log(newData);
        this.setState({
            loading: true,
        },() => {
            setTimeout(() => {
                this.setState({
                    data: newData,
                    unassigned: newUnassigned,
                    loading: false
                });
            }, 2000)
        });
    };
    unassignDate(index) {
        let selectedTask = this.state.data[index];
        selectedTask.setDate(null);

        let newData = this.state.data.slice();
        newData = removeIndex(newData, index);
        console.log(newData);

        let newUnassigned = this.state.unassigned.slice();
        newUnassigned.push(selectedTask);
        unassignFromDate(selectedTask);

        this.setState({
            loading: true,
        },() => {
            setTimeout(() => {
                this.setState({
                    data: newData,
                    unassigned: newUnassigned,
                    loading: false
                });
            }, 2000)
        });
    }
    handleCheck(i) {
        let state = this.state.data[i].getState();

        let selectedTask = this.state.data[i];
        this.state.data[i].setState(!state);
        this.setState((oldState) => {
            return {
                checked: !oldState.checked,
                color: !oldState.checked === true ? 'grey' : 'white'
            };
        });
        markRequest(selectedTask);
    }

    removeTask = function (e, i) {
        let selectedTask = this.state.data[i];
        this.setState(state => ({
            data: state.data.filter((x, j) => j !== i),
        }));
        deleteRequest(selectedTask);
    };



    getIndex = (id) => {
        let length = this.state.data.length;
        for (let i = 0; i < length; i++) {
            if(this.state.data[i].getID() === id){
                return i;
            }
        }
    };

    containsCategoryToDisplay(categoryID) {
        for(let i = 0; i < this.props.categoriesToDisplay.length; i++){
            if(this.props.categoriesToDisplay[i].getID() === categoryID){
                return true;
            }
        }
        return false;
    }

    render(){
        return(
            <div>
                <div align="center">
                <h1 className="title">
                    <PreviousWeekIcon id={"prevWeekIcon"} onClick={(e) => {this.previousWeek()}}/>
                    <PreviousDayIcon id={"prevDayIcon"} onClick={(e) => {this.previousDay()}}/>
                    {this.state.currentDateTitle}
                    <NextDayIcon id={"nextDayIcon"} onClick={(e) => {this.nextDay()}}/>
                    <NextWeekIcon id={"nextWeekIcon"} onClick={(e) => {this.nextWeek()}}/>
                </h1>
                </div>

            <Table selectable={getCalendarDayStateTable().selectable}
                style={{ tableLayout: 'auto', width: 600, margin: 'auto' }}>
                <TableHeader displaySelectAll = {getCalendarDayStateTable().displaySelectAll}
                             adjustForCheckbox = {getCalendarDayStateTable().showCheckboxes}>

                    <TableRow style ={{ width: 600, background: '#354778' ,padding: '5px 20px', height: 10}} >
                        <TableHeaderColumn style={{width:60}}>Status</TableHeaderColumn>
                        <TableHeaderColumn style={{width:150, textColor: '#fff'}}>Name</TableHeaderColumn>
                        <TableHeaderColumn style={{width:60, textColor: '#fff'}}>Delete</TableHeaderColumn>
                        <TableHeaderColumn style={{width:60, textColor: '#fff'}}>Unassign</TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox = {getCalendarDayStateTable().showCheckboxes}>
                    {this.state.data.filter(task => this.containsCategoryToDisplay(task.getCategoryID())).map( (row, index) => (
                        <TableRow key={index}  style={{ padding: '5px 20px', height: 25, width: 50, background : getRowStatusStyle(index, this.state.data) }}>
                            <TableRowColumn style={{width:60}}>
                                <Checkbox id="taskStatus"
                                          checked={row.getState()}
                                          onCheck={() => this.handleCheck(this.getIndex(row.getID()))}
                                />
                            </TableRowColumn>
                            <TableRowColumn style={{width:150}}>{row.name}</TableRowColumn>
                            <TableRowColumn style={{width:60}}>
                                <TrashIcon id="trashIcon" onClick={(e) => { this.removeTask(e, this.getIndex(row.getID())) }}/>
                            </TableRowColumn>
                            <TableRowColumn style={{width:60}}>
                                <UnassignIcon id="unassignIcon" onClick={(e) => {this.unassignDate(index)}}/>
                            </TableRowColumn>
                        </TableRow>
                    ))}

                </TableBody>
            </Table>
            <h2 align="center" className="title"> Unassigned tasks
            </h2>
                <Table
                       selectable={getUnassignedStateTable().selectable}
                       style={{ width: 400, margin: 'auto'}}>
                <TableHeader displaySelectAll = {getUnassignedStateTable().displaySelectAll}
                             adjustForCheckbox = {getUnassignedStateTable().showCheckboxes}>
                    <TableRow style ={{background: '#354778', padding: '5px 20px', height: 10}} >
                        <TableHeaderColumn>Name</TableHeaderColumn>
                        <TableHeaderColumn style={{width:50}}>Assign</TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox = {getUnassignedStateTable().showCheckboxes}>
                    {this.state.unassigned.filter(task => this.containsCategoryToDisplay(task.getCategoryID())).map( (row, index) => (
                        <TableRow
                            key={index}  style={{ padding: '5px 20px', height: 25, width: 50, background : getRowStatusStyle(index, this.state.unassigned) }}>
                            <TableRowColumn>{row.name}</TableRowColumn>
                            <TableRowColumn style={{width:50}}>
                                <AssignIcon id="assignIcon" onClick={(e) => {this.assignDate(index)}}/>
                            </TableRowColumn>
                        </TableRow>

                    ))}
                </TableBody>
            </Table>
            {this.state.loading ? <Loader/> : <div></div>}
        </div>
        )
    }

}
export default CalendarUI