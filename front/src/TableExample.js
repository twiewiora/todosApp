import React from 'react';
import {
    Table,
    TableBody,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';
import {RaisedButton} from "material-ui";

const state = {
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


export default ({ data}) => {

    this.setTaskState = function (e) {
        alert(e.valueOf());
        e.preventDefault();
    }
    return (
            <div>
                <form>

                </form>
                <Table
                    fixedHeader={state.fixedHeader}
                    fixedFooter={state.fixedFooter}
                    selectable={state.selectable}
                    multiSelectable={state.multiSelectable}
                >
                    <TableBody
                        displayRowCheckbox={state.showCheckboxes}
                        deselectOnClickaway={state.deselectOnClickaway}
                        showRowHover={state.showRowHover}
                        stripedRows={state.stripedRows}
                    >
                        {data.map((row, i) =>

                            <TableRow key={i} onChange={ (e) => { this.setTaskState(e) } }>
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
                                        onClick={(e) => { this.setTaskState(e) }}
                                    />
                                </TableRowColumn>
                                <TableRowColumn>
                                    <RaisedButton
                                        label="Delete"
                                        id={i}
                                        onClick={() => { alert(i); }}
                                    />
                                </TableRowColumn>

                        </TableRow>)}
                    </TableBody>
                </Table>
            </div>
        );

}