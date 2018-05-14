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
import {swapRequest} from "./Requests/Requests";
import {getMainStateTable} from "./Styles/TablesStates";


const SortableItem = SortableElement(({index, row, getIndex, removeTask, handleCheck}) =>
    <TableRow key={getIndex(row.getID())}
              style={{ padding: '5px 20px', height: 25, background : getStripedStyle(getIndex(row.getID()), row.getState()) }}>
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

        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    handleKeyPress(event) {
        if (event.key === 'Enter') {
            this.props.addTask();
        }
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

    render() {
        if(this.props.ifSetDragnDrop){
            return (
                <div>
                    <h1 className="title"> New task </h1>
                    <TextField id="taskName" hintText="name" onKeyPress={this.handleKeyPress} /><br />
                    <RaisedButton
                        label="Add task"
                        id="addButton"
                        onClick={(e) => {
                            this.props.addTask(e)
                        }}
                    /><br/><br/>

                    <SortableTable getData={this.props.getData.bind(this)} getIndex={this.props.getIndex.bind(this)}
                                   removeTask={this.props.removeTask.bind(this)} handleCheck={this.props.handleCheck.bind(this)}
                                   onSortEnd={this.onSortEnd}/>
                    <br/>
                    {this.props.appLoading? <Loader/> : <div></div>}
                </div>
            );
        } else{
            return (
                <div>
                    <h1 className="title"> New task </h1>
                    <TextField id="taskName" hintText="name" onKeyPress={this.handleKeyPress} /><br />
                    <RaisedButton
                        label="Add task"
                        id="addButton"
                        onClick={(e) => {
                            this.props.addTask(e)
                        }}
                    /><br/><br/>
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
                            {this.props.getData().filter(task => task.visible).map((value, index) => (
                                <TableRow key={index}
                                          style={{ padding: '5px 20px', height: 25, background : getStripedStyle(index, value.getState()) }}>
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