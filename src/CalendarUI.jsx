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
import PreviousDayButton from 'mui-icons/mdi/fast_rewind';
import NextDayButton from 'mui-icons/mdi/fast_forward';
import NextWeekButton from 'mui-icons/mdi/skip_next';
import PreviousWeekButton from 'mui-icons/mdi/skip_previous';
import AssignButton from 'mui-icons/mdi/call_made';
import {assignToDate, getUnassignedTasks, getDailyTasks, markRequest, deleteRequest} from "./Requests/Requests";
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

    render(){
        return(
            <div>
                <div align="center">
                <h1 className="title">
                    <IconButton>
                        <PreviousWeekButton onClick={(e) => {this.previousWeek()}}/>
                    </IconButton>
                    <IconButton>
                        <PreviousDayButton onClick={(e) => {this.previousDay()}}/>
                    </IconButton>
                    {this.state.currentDateTitle}
                <IconButton>
                    <NextDayButton onClick={(e) => {this.nextDay()}}/>
                </IconButton>
                <IconButton>
                    <NextWeekButton onClick={(e) => {this.nextWeek()}}/>
                </IconButton>
                </h1>
                </div>

            <Table
                selectable={getCalendarDayStateTable().selectable}
                style={{ tableLayout: 'auto', width: 400, margin: 'auto' }}
            >
                <TableHeader displaySelectAll = {getCalendarDayStateTable().displaySelectAll}
                             adjustForCheckbox = {getCalendarDayStateTable().showCheckboxes}
                >
                    <TableRow style ={{ background: '#ccccff' , padding: '5px 20px', height: 10}} >
                        <TableHeaderColumn>Status</TableHeaderColumn>
                        <TableHeaderColumn>Name</TableHeaderColumn>
                        <TableHeaderColumn>Delete</TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox = {getCalendarDayStateTable().showCheckboxes}>
                    {this.state.data.map( (row, index) => (
                        <TableRow key={index}  style={{ padding: '5px 20px', height: 25, width: 50, background : getRowStatusStyle(index, this.state.data) }}>
                            <TableRowColumn>
                                <Checkbox id="taskStatus"
                                          checked={row.getState()}
                                          onCheck={() => this.handleCheck(this.getIndex(row.getID()))}
                                />
                            </TableRowColumn>
                            <TableRowColumn>{row.name}</TableRowColumn>
                            <TableRowColumn>
                                <TrashIcon id="trashIcon" onClick={(e) => { this.removeTask(e, this.getIndex(row.getID())) }}/>
                            </TableRowColumn>
                        </TableRow>

                    ))}

                </TableBody>
            </Table>
            <h1 align="center" className="title"> Unassigned tasks
            </h1>
                <Table
                       selectable={getUnassignedStateTable().selectable}
                       style={{ width: 400, margin: 'auto'}}>
                <TableHeader displaySelectAll = {getUnassignedStateTable().displaySelectAll}
                             adjustForCheckbox = {getUnassignedStateTable().showCheckboxes}
                >
                    <TableRow style ={{ background: '#ccccff' , padding: '5px 20px', height: 10}} >
                        <TableHeaderColumn>Name</TableHeaderColumn>
                        <TableHeaderColumn>Assign</TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox = {getUnassignedStateTable().showCheckboxes}>
                    {this.state.unassigned.map( (row, index) => (
                        <TableRow
                            key={index}  style={{ padding: '5px 20px', height: 25, width: 50, background : getRowStatusStyle(index, this.state.unassigned) }}>
                            <TableRowColumn>{row.name}</TableRowColumn>
                            <TableRowColumn>
                                <IconButton>
                                    <AssignButton onClick={(e) => {this.assignDate(index)}}/>
                                </IconButton>
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