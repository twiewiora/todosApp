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
import Task from "./Task/Task";

import Info from 'mui-icons/mdi/info';

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

class CalendarUI extends Component {
    constructor(props) {
        let newTask = new Task("Meh", -1);
        newTask.setState(true);
        let newTask2 = new Task("Bum", -1);
        newTask.setState(false);
        super(props);
        this.state = {
            selected: [],
            data: [newTask, newTask2],
            open: false,
            descriptionName: "",
            descriptionStatus: "",
            currentDate: 0,
        }
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();

        if(dd<10) {
            dd = '0'+dd
        }

        if(mm<10) {
            mm = '0'+mm
        }

        today = mm + '/' + dd + '/' + yyyy;
        this.state.currentDate = today;
    };

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

    showDialog(index) {
        let name = this.state.data[index].getName();
        console.log(this.state.data[index]);
        let status = this.state.data[index].getState() ? "done" : "undone";
        this.setState({descriptionName: "Name: " + name});
        this.setState({descriptionStatus: "Status: " + status});
        this.setState({open: true});
    }
    render(){
        return(
            <div>
                <h1 align="center" className="title"> {this.state.currentDate} </h1>
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
                                    <Info onClick={(e) => { this.showDialog(index)}}/>
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

        </div>
        )
    }


}
export default CalendarUI