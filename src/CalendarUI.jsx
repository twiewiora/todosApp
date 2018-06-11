import React, {Component} from "react";
import './Styles/App.css';
import {
    Checkbox,
    RaisedButton,
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn
} from "material-ui";

import IconButton from '@material-ui/core/IconButton'
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
    unassignFromDate, getWeeklyTasks, getAllCategories,
} from "./Requests/Requests";
import Loader from "./Loader/Loader";
import {getRowStatusStyle} from "./Styles/Styling";
import {findTaskIndexInArray, removeIndex, removeTaskFromArray} from "./Utils/ArrayFunctions";
import {americanDate, dateFormat, reverseDate, sortDateFunction} from "./Utils/DateFunctions";
import {getCalendarDayStateTable, getUnassignedStateTable} from "./Styles/TablesStates";
import Category from "./Category/Category";

let weekDisplay = false;
class CalendarUI extends Component {
    constructor(props) {
        super(props);

        const today = new Date();

        this.state = {
            data: [],
            unassigned: [],
            weekly: [],
            loading: true,
            currentDateObject: today,
            currentDateTitle: dateFormat(today),
            weeklyViewDisplayed: false
        };
    };

    componentWillMount() {
        this.reloadPage();
    }

    showWeekly = () => {
        if (weekDisplay){
            let section = document.getElementById('weeklyView');
            if(section !== null){
                section.style.display = 'none';
                weekDisplay = false;

                this.setState({
                    weekly: [],
                    weeklyViewDisplayed: false
                });
            }

        }
        else {
            let section = document.getElementById('weeklyView');
            if(section !== null) {
                section.style.display = 'block';
                weekDisplay = true;
                getWeeklyTasks(this.state.currentDateTitle).then( w =>
                    this.setState({
                        weekly: w.sort(sortDateFunction),
                    })
                );
                this.setState({weeklyViewDisplayed: true});
            }
        }
    };

    reloadPage = () => {
        this.setState({
            loading: true,
        });
        getUnassignedTasks().then(u => {
            console.log(u);
            this.setState({
                unassigned: u
            })
        });
        getDailyTasks(this.state.currentDateTitle).then(d => {
            this.setState({
                data: d
            })
        });
        getWeeklyTasks(this.state.currentDateTitle).then(w => {
            this.setState({
                weekly: w.sort(sortDateFunction),
                loading: false,
            })
        });

    };
    reloadTasks(date){
        this.setState({
            loading: true,
            currentDateObject: date,
        });

        let dateDescription = dateFormat(date);
        getDailyTasks(dateDescription).then(d => {
            this.setState({
                data: d,
                currentDateTitle: dateDescription,
            })
        });
        getWeeklyTasks(dateDescription).then(w => {
            this.setState({
                weekly: w.sort(sortDateFunction),
            })
        });
        this.setState({
            loading: false
        })

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

    assignDate (index) {
        this.setState({
            loading: true,
        });

        let selectedTask = this.state.unassigned[index];
        selectedTask.setDate(this.state.currentDateTitle);

        let newUnassigned = this.state.unassigned.slice();
        newUnassigned = removeIndex(newUnassigned, index);

        let newData = this.state.data.slice();
        newData.push(selectedTask);
        console.log(americanDate(selectedTask.getDate()))
        let weeklyData = this.state.weekly.slice();
        weeklyData.push(selectedTask);
        this.setState({
            loading: true,
        });
        assignToDate(selectedTask);
        this.setState({
            data: newData,
            weekly: weeklyData.sort(sortDateFunction),
            unassigned: newUnassigned,
            loading: false
        });
    };
    unassignDate(index) {
        this.setState({
            loading: true,
        });

        let selectedTask = this.state.data[index];
        console.log(americanDate(selectedTask.getDate()));
        selectedTask.setDate(null);

        let newData = this.state.data.slice();
        newData = removeIndex(newData, index);

        let newWeekly = this.state.weekly.slice();
        newWeekly = removeTaskFromArray(newWeekly, selectedTask);

        let newUnassigned = this.state.unassigned.slice();
        newUnassigned.push(selectedTask);
        unassignFromDate(selectedTask);

        this.setState({
            data: newData,
            weekly: newWeekly,
            unassigned: newUnassigned,
            loading: false
        });

    }
    handleCheck(i) {
        let state = this.state.data[i].getState();

        let selectedTask = this.state.data[i];
        let weeklyIndex = findTaskIndexInArray(this.state.weekly, selectedTask);
        this.state.data[i].setState(!state);
        this.state.weekly[weeklyIndex].setState(!state);
        this.setState((oldState) => {
            return {
                checked: !oldState.checked,
                color: !oldState.checked === true ? 'grey' : 'white'
            };
        });
        markRequest(selectedTask);
    }

    removeTask (e, i) {
        let selectedTask = this.state.data[i];
        this.setState(state => ({
            data: state.data.filter((x, j) => j !== i),
            weekly: state.weekly.filter((x, j) => j !== i),
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
                    <RaisedButton id={"weeklyViewButton"}
                                  label= {this.state.weeklyViewDisplayed ? "Hide weekly view" : "Show weekly view"}
                                  style = {{margin: 'auto'}}
                                  onClick={this.showWeekly}
                    /><br/><br/>

            </div>
            <div className="weekTable" id ="weeklyView">
                <h2 align="center" className="title"> Weekly tasks
                </h2>
                <Table selectable={getCalendarDayStateTable().selectable}
                           style={{ tableLayout: 'auto', width: 600, margin: 'auto' }}>
                        <TableHeader displaySelectAll = {getCalendarDayStateTable().displaySelectAll}
                                     adjustForCheckbox = {getCalendarDayStateTable().showCheckboxes}>
                            <TableRow style ={{ width: 600, background: '#354778' ,padding: '5px 20px', height: 10}} >
                                <TableHeaderColumn style={{width:50}}>Status</TableHeaderColumn>
                                <TableHeaderColumn style={{width:150, textColor: '#fff'}}>Name</TableHeaderColumn>
                                <TableHeaderColumn style={{width:100}}>Date</TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                    <TableBody displayRowCheckbox = {getUnassignedStateTable().showCheckboxes}>

                        {this.state.weekly.filter(task => this.containsCategoryToDisplay(task.getCategoryID())).map( (row, index) => (
                            <TableRow
                                key={index}  style={{ padding: '5px 20px', height: 25, width: 50, background : getRowStatusStyle(index, this.state.weekly) }}>
                                <TableRowColumn style={{width:50}}>
                                <Checkbox checked={row.getState()} disabled={true}/>
                                </TableRowColumn>
                                <TableRowColumn style = {{width: 150}}>{row.name}</TableRowColumn>
                                <TableRowColumn style={{width:100}}>
                                    {americanDate(row.getDate()) ? row.getDate() : reverseDate(row.getDate())}
                                </TableRowColumn>
                            </TableRow>

                        ))}

                    </TableBody>
                </Table>
            </div>
                <h2 align="center" className="title"> Daily tasks
                </h2>
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
                                <IconButton id={"trashButton"}
                                            onClick={(e) => { this.removeTask(e, this.getIndex(row.getID())) }}
                                            aria-label="Delete">
                                <TrashIcon id="trashIcon"/>
                                </IconButton>
                            </TableRowColumn>
                            <TableRowColumn style={{width:60}}>
                                <IconButton id={"unassignButton"}
                                            onClick={(e) => {this.unassignDate(index)}}
                                            aria-label="Unassign">
                                <UnassignIcon id="unassignIcon" />
                                </IconButton>
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
                                <IconButton id = "assingButton" onClick={(e) => {this.assignDate(index)}}>
                                <AssignIcon id="assignIcon" />
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