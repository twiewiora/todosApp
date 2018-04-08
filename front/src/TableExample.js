import React from 'react';
import {
    Table,
    TableBody,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';

const state = {
    fixedHeader: true,
    fixedFooter: true,
    stripedRows: false,
    showRowHover: false,
    selectable: true,
    multiSelectable: false,
    enableSelectAll: false,
    deselectOnClickaway: true,
    showCheckboxes: false,
    height: '300px',
};


export default ({ data}) => {

        return (
            <div>
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
                            <TableRow key={i}>
                                <TableRowColumn>{row}</TableRowColumn>
                        </TableRow>)}
                    </TableBody>
                </Table>
            </div>
        );
}