import React, {Component} from 'react';
import {
    Table,
    TableBody,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';
import {RaisedButton, TextField} from "material-ui";
import TrashIcon from "material-ui/svg-icons/action/delete"

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

function handleCellClick (rowNumber, columnNumber, evt) {
    //alert(rowNumber)
}



class MaterialUIs extends Component {
    state = {
        data: []
    };

    addTask = function (e) {
        let name = document.getElementById("taskName").value;

        this.setState({data : [...this.state.data, name]});
        e.preventDefault();
    };

    removeTask = function (e, i) {
        this.setState(state => ({
            data: state.data.filter((x, j) => j !== i),
        }));
        e.preventDefault();
    };

    setTaskState = function (e, i) {
        alert(i);
        e.preventDefault();
    };
    render() {
        return (
            <div>
                <TextField id="taskName" hintText="name"/><br />
                <RaisedButton
                    label="Add task"
                    id="addButton"
                    onClick={(e) => { this.addTask(e) }}
                />
                <Table
                    fixedHeader={stateTable.fixedHeader}
                    fixedFooter={stateTable.fixedFooter}
                    selectable={stateTable.selectable}
                    multiSelectable={stateTable.multiSelectable}
                    onCellClick={handleCellClick }
                >
                    <TableBody
                        displayRowCheckbox={stateTable.showCheckboxes}
                        deselectOnClickaway={stateTable.deselectOnClickaway}
                        showRowHover={stateTable.showRowHover}
                        stripedRows={stateTable.stripedRows}
                    >
                        {this.state.data.map((row, i) =>

                            <TableRow key={i} onClick={ (e) => { this.setTaskState(e, i) } }>
                                <TableRowColumn>
                                    {row}
                                </TableRowColumn>
                                <TableRowColumn>
                                    undone
                                </TableRowColumn>
                                <TableRowColumn>
                                    <RaisedButton
                                        label="Set as done"
                                        id={i}
                                        onClick={(e) => { this.setTaskState(e, i) }}
                                    />
                                </TableRowColumn>
                                <TableRowColumn>
                                    <TrashIcon onClick={(e) => { this.removeTask(e, i) }}/>
                                </TableRowColumn>

                            </TableRow>)}
                    </TableBody>
                </Table>
            </div>
        );
    }

}

export default MaterialUIs;