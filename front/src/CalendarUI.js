import React, {Component} from "react";
import './Styles/App.css';
import {
    Dialog,
    FlatButton,
    IconButton,
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn
} from "material-ui";
import {getStripedStyle} from "./Styles/Styling";

import InfoButton from 'mui-icons/mdi/info_outline';
import PreviousDayButton from 'mui-icons/mdi/fast_rewind';
import NextDayButton from 'mui-icons/mdi/fast_forward';
import NextWeekButton from 'mui-icons/mdi/skip_next';
import PreviousWeekButton from 'mui-icons/mdi/skip_previous';
import AssignButton from 'mui-icons/mdi/call_made';
import {assignToDate, getUnassignedTasks, getWeekTasks} from "./Requests/Requests";
import Loader from "./Loader/Loader";

const mainTableState = {
    fixedHeader: true,
    fixedFooter: true,
    stripedRows: false,
    showRowHover: false,
    selectable: false,
    multiSelectable: false,
    enableSelectAll: true,
    deselectOnClickaway: false,
    showCheckboxes: false,
    displaySelectAll: false,
};
const unassignedTableState = {
    fixedHeader: true,
    fixedFooter: true,
    stripedRows: false,
    showRowHover: false,
    selectable: false,
    multiSelectable: false,
    enableSelectAll: false,
    deselectOnClickaway: false,
    showCheckboxes: false,
    displaySelectAll: false,
};
class CalendarUI extends Component {
    constructor(props) {
        super(props);

        const today = new Date();

        this.state = {
            data: [],
            weekData: [],
            unassigned: [],
            open: false,
            descriptionName: "",
            descriptionStatus: "",
            loading: true,
            loadingAssign: false,
            currentDateObject: today,
            currentDateTitle: this.getDateDescription(today),
        };
    };
    componentDidMount() {
        window.addEventListener('load', this.reloadPage);

    }
    componentWillMount() {
        this.reloadPage();
    }

    reloadPage = () => {
        this.setState({loading: true});
        let weeklyTasks =  getWeekTasks(this.state.currentDateTitle);
        let dailyTasks = [];
        let unassignedTasks = getUnassignedTasks();
        this.setState({
            loading: true
        },() => {
            setTimeout(() => {
                dailyTasks = this.getDailyTasks(weeklyTasks);
                this.setState({
                    weekData: weeklyTasks,
                    data: dailyTasks,
                    unassigned: unassignedTasks,
                    loading: false
                });
            }, 3000)
        });

    };

    nextWeek() {
        console.log("NEXT WEEK");
        console.log(this.state.currentDateObject);
        var newDate = this.state.currentDateObject;
        newDate.setDate(newDate.getDate()+7);
        console.log(newDate);
        this.setState({
            currentDateObject: newDate,
            currentDateTitle: this.getDateDescription(newDate)
        });
    }
    previousWeek() {
        console.log("PREVIOUS WEEK");
        console.log(this.state.currentDateObject);
        var newDate = this.state.currentDateObject;
        newDate.setDate(newDate.getDate()-7);
        console.log(newDate);
        this.setState({
            currentDateObject: newDate,
            currentDateTitle: this.getDateDescription(newDate)
        });
    }
    getDateDescription(date){
        let dd = date.getDate();
        let mm = date.getMonth() + 1; //January is 0!
        let yyyy = date.getFullYear();

        if(dd<10) {
            dd = '0'+dd
        }

        if(mm<10) {
            mm = '0'+mm
        }

        return dd + '-' + mm + '-' + yyyy;
    }
    getReversedDateDescription(date){
        let dd = date.getDate();
        let mm = date.getMonth()+1; //January is 0!
        let yyyy = date.getFullYear();

        if(dd<10) {
            dd = '0'+dd
        }

        if(mm<10) {
            mm = '0'+mm
        }

        return yyyy + '-' + mm + '-' + dd;
    }

    handleClose = () => {
        this.setState({open: false});
    };

    customContentStyle = {
        width: '100%',
        maxWidth: 'none',
    };
    actions = [
        <FlatButton
            label={"OK"}
            primary={true}
            onClick={this.handleClose}
        />,
    ];

    getDailyTasks = (tasks) => {
        let dailyTasks = [];
        for (let i = 0; i < tasks.length; i++){
            if (this.getReversedDateDescription(this.state.currentDateObject) === tasks[i].getDate()){
                dailyTasks.push(tasks[i]);
            }
        }
        return dailyTasks
    };

    showDialog = (index) => {
        let name = this.state.data[index].getName();
        let status = this.state.data[index].getState();
        this.setState({
            descriptionName: "Name: " + name,
            descriptionStatus: "Status: " + status,
            open: true
        });
    };

    assignDate = (index) => {
        let selectedTask = this.state.unassigned[index];
        selectedTask.setDate(this.state.currentDateTitle);
        assignToDate(selectedTask);
        this.reloadPage();
    };

    previousDay = () => {
        var newDate = this.state.currentDateObject;
        newDate.setDate(newDate.getDate()-1);
        this.setState({
            currentDateObject: newDate,
            currentDateTitle: this.getDateDescription(newDate),
            data: this.getDailyTasks(this.state.weekData),
        });
    };

    nextDay = () => {
        var newDate = this.state.currentDateObject;
        newDate.setDate(newDate.getDate()+1);
        this.setState({
            currentDateObject: newDate,
            currentDateTitle: this.getDateDescription(newDate),
            data: this.getDailyTasks(this.state.weekData),
        });
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

                {this.state.loading && <Loader/>}
            <Table selectable={mainTableState.selectable} style={{ width: 400, margin: 'auto' }}>
                <TableHeader displaySelectAll = {mainTableState.displaySelectAll}
                             adjustForCheckbox = {mainTableState.showCheckboxes}
                >
                    <TableRow style ={{ background: '#ccccff' , padding: '5px 20px', height: 10}} >
                        <TableHeaderColumn>Name</TableHeaderColumn>
                        <TableHeaderColumn>Info</TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox = {mainTableState.showCheckboxes}>
                    {this.state.data.map( (row, index) => (
                        <TableRow key={index}  style={{ padding: '5px 20px', height: 25, width: 50, background : getStripedStyle(index) }}>
                            <TableRowColumn>{row.name}</TableRowColumn>
                            <TableRowColumn>
                                <IconButton>
                                    <InfoButton onClick={(e) => { this.showDialog(index)}}/>
                                </IconButton>
                            </TableRowColumn>
                        </TableRow>

                    ))}
                    <Dialog
                        title="Task info"
                        actions={this.actions}
                        modal={true}
                        contentStyle={this.customContentStyle}
                        open={this.state.open}
                    >
                        {this.state.descriptionName} <br/> {this.state.descriptionStatus}
                    </Dialog>

                </TableBody>
            </Table>
            <h1 align="center" className="title"> Unassigned tasks
            </h1>
                <Table
                       selectable={unassignedTableState.selectable}
                       style={{ width: 400, margin: 'auto' }}>
                <TableHeader displaySelectAll = {unassignedTableState.displaySelectAll}
                             adjustForCheckbox = {unassignedTableState.showCheckboxes}
                >
                    <TableRow style ={{ background: '#ccccff' , padding: '5px 20px', height: 10}} >
                        <TableHeaderColumn>Name</TableHeaderColumn>
                        <TableHeaderColumn>Assign to current date</TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox = {unassignedTableState.showCheckboxes}>
                    {this.state.unassigned.map( (row, index) => (
                        <TableRow
                            key={index}  style={{ padding: '5px 20px', height: 25, width: 50, background : getStripedStyle(index) }}>
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
                {this.state.loadingAssign && <Loader/>}
        </div>
        )
    }



}
export default CalendarUI