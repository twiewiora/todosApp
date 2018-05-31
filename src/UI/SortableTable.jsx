import React from 'react';
import {
    Table,
    TableBody,
    TableRow
}
    from 'material-ui/Table';
import { TableHeaderColumn} from "material-ui";
import {SortableContainer} from 'react-sortable-hoc';
import '../Styles/App.css';
import {getMainStateTable} from "../Styles/TablesStates";
import SortableItem from "./SortableItem"


const SortableTable = SortableContainer(({getData, getIndex, removeTask, handleCheck, getEditVisibility}) => {
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
                <TableRow style ={{ background: '#354778' , padding: '5px 20px', height: 10}} >
                    {
                        getEditVisibility()
                            ? (<TableHeaderColumn>Edit</TableHeaderColumn>)
                            : null
                    }
                    <TableHeaderColumn>Status</TableHeaderColumn>
                    <TableHeaderColumn>Name</TableHeaderColumn>
                    <TableHeaderColumn>Category</TableHeaderColumn>
                    <TableHeaderColumn>Date</TableHeaderColumn>
                    <TableHeaderColumn>Delete</TableHeaderColumn>
                </TableRow>
                {getData().map((value, index) => (
                    <SortableItem key={`item-${index}`} index={index} row={value}
                                  getIndex={getIndex} removeTask={removeTask} handleCheck={handleCheck}
                                  getEditVisibility={getEditVisibility}/>
                ))}
            </TableBody>
        </Table>
    );
});

export default SortableTable;